import { describe, it, expect, vi, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

const { getPayload } = await import('payload')
const { GET } = await import('@/app/api/products/route')

describe('/api/products', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns published products', async () => {
    const find = vi.fn().mockResolvedValue({
      docs: [
        { slug: 'prod1', listingName: 'Product 1', summary: 'Summary', heroImage: 'image.jpg' },
      ],
      totalDocs: 1,
      totalPages: 1,
      page: 2,
      limit: 10,
    })
    ;(getPayload as any).mockResolvedValue({ find })

    const req = new Request('http://localhost/api/products?limit=10&page=2') as NextRequest
    const res = await GET(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.docs).toHaveLength(1)
    expect(json.totalDocs).toBe(1)
    expect(find).toHaveBeenCalledWith({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 10,
      page: 2,
      select: { slug: true, listingName: true, summary: true, heroImage: true },
    })
  })

  it('throws when getPayload fails', async () => {
    ;(getPayload as any).mockRejectedValue(new Error('fail'))
    const req = new Request('http://localhost/api/products') as NextRequest
    await expect(GET(req)).rejects.toThrow('fail')
  })
})
