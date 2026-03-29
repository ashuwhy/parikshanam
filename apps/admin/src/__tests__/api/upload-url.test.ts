import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
    },
  })),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    storage: {
      from: () => ({
        createSignedUploadUrl: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
  }),
}))

describe('POST /api/upload-url', () => {
  it('returns 400 when courseId or mimeType is missing', async () => {
    const { POST } = await import('@/app/api/upload-url/route')
    const req = new Request('http://localhost/api/upload-url', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
