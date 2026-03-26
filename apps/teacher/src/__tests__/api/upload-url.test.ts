import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))

describe('POST /api/upload-url', () => {
  it('returns 400 when courseId is missing', async () => {
    const { POST } = await import('@/app/api/upload-url/route')
    const req = new Request('http://localhost/api/upload-url', {
      method: 'POST',
      body: JSON.stringify({ mimeType: 'video/mp4' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
