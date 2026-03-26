import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valid: false, reason: 'token required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: invite, error } = await admin
    .from('teacher_invites')
    .select('id, email, expires_at, accepted_at')
    .eq('token', token)
    .single()

  if (error || !invite) {
    return NextResponse.json({ valid: false, reason: 'invalid token' }, { status: 404 })
  }

  if (invite.accepted_at) {
    return NextResponse.json({ valid: false, reason: 'already used' }, { status: 410 })
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'expired' }, { status: 410 })
  }

  return NextResponse.json({ valid: true, email: invite.email })
}
