import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))

describe('GET /api/invites/verify', () => {
  it('returns 400 when token is missing', async () => {
    const { GET } = await import('@/app/api/invites/verify/route')
    const req = new Request('http://localhost/api/invites/verify')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/invites/accept', () => {
  it('returns 400 when token or password is missing', async () => {
    const { POST } = await import('@/app/api/invites/accept/route')
    const req = new Request('http://localhost/api/invites/accept', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
