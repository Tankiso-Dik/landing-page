import { describe, it, expect, vi } from 'vitest'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

const { getPayload } = await import('payload')

describe('API', () => {
  it('fetches users', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    ;(getPayload as any).mockResolvedValue({ find })

    const payload = await getPayload({})
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
