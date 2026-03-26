import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { courseId, lessonId, mimeType } = body

  if (!courseId || !mimeType) {
    return NextResponse.json({ error: 'courseId and mimeType required' }, { status: 400 })
  }

  const ext = mimeType === 'video/webm' ? 'webm' : 'mp4'
  const path = `courses/${courseId}/lesson-${lessonId ?? crypto.randomUUID()}.${ext}`

  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('course-videos')
    .createSignedUploadUrl(path)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path })
}
