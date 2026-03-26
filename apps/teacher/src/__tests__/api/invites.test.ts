import { describe, it, expect, vi, beforeEach } from 'vitest'

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
  beforeEach(() => {
    vi.resetModules()
  })

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

  it('returns 409 when the atomic claim fails (invite already used by concurrent request)', async () => {
    const { createAdminClient } = await import('@/lib/supabase/admin')

    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'invite-1',
            email: 'teacher@example.com',
            accepted_at: null,
            expires_at: new Date(Date.now() + 60_000).toISOString(),
          },
          error: null,
        }),
      }),
    })

    // Chain for atomic claim: .update().eq().is().select().single()
    const mockClaimSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'no rows' } })
    const mockClaimSelect = vi.fn().mockReturnValue({ single: mockClaimSingle })
    const mockClaimIs = vi.fn().mockReturnValue({ select: mockClaimSelect })
    const mockClaimEq = vi.fn().mockReturnValue({ is: mockClaimIs })
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockClaimEq })

    const mockFrom = vi.fn((table: string) => {
      if (table === 'teacher_invites') {
        return {
          select: mockSelect,
          update: mockUpdate,
        }
      }
      return {}
    })

    vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as never)

    const { POST } = await import('@/app/api/invites/accept/route')
    const req = new Request('http://localhost/api/invites/accept', {
      method: 'POST',
      body: JSON.stringify({ token: 'valid-token', password: 'password123' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('invite already used')
  })
})
