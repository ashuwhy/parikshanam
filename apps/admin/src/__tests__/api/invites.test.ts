import { describe, it, expect, vi } from 'vitest'

describe('POST /api/invites/send', () => {
  it('returns 400 when email is missing', async () => {
    // Mock dependencies
    vi.mock('@/lib/supabase/admin', () => ({
      createAdminClient: () => ({ from: vi.fn() }),
    }))
    vi.mock('@/lib/supabase/server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-id' } } }) },
      }),
    }))
    vi.mock('resend', () => ({
      Resend: class { emails = { send: vi.fn().mockResolvedValue({}) } },
    }))

    const { POST } = await import('@/app/api/invites/send/route')
    const req = new Request('http://localhost/api/invites/send', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
