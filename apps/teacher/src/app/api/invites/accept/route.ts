import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { token, password, fullName } = body

  if (!token || !password) {
    return NextResponse.json({ error: 'token and password required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Re-verify token (not expired, not used)
  const { data: invite } = await admin
    .from('teacher_invites')
    .select('id, email, accepted_at, expires_at')
    .eq('token', token)
    .single()

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'invalid or expired token' }, { status: 400 })
  }

  // Create the Supabase auth user
  const { data: authData, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  const userId = authData.user.id

  // The handle_new_user trigger already created a profiles row with role='student'
  // Update it to teacher and set the name
  await admin
    .from('profiles')
    .update({ role: 'teacher', full_name: fullName ?? null })
    .eq('id', userId)

  // Mark invite as accepted
  await admin
    .from('teacher_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  return NextResponse.json({ ok: true, email: invite.email })
}
