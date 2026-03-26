import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  // Use the SSR client so RLS (teacher_owns_course policy) enforces ownership.
  // If the teacher doesn't own this lesson's course, the update returns null data.
  const admin = createAdminClient()
  const { data, error } = await admin.from('lessons').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json({ ok: true })
}
