import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { courseId, lessonId, mimeType } = body

  if (!courseId || !mimeType) {
    return NextResponse.json({ error: 'courseId and mimeType required' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
  }

  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
  // Fixed path per resource so replacing always overwrites the old file
  const path = lessonId
    ? `courses/${courseId}/lessons/${lessonId}/thumbnail.${ext}`
    : `courses/${courseId}/thumbnail.${ext}`

  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('course-thumbnails')
    .createSignedUploadUrl(path, { upsert: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage
    .from('course-thumbnails')
    .getPublicUrl(path)

  return NextResponse.json({ token: data.token, path, publicUrl })
}
