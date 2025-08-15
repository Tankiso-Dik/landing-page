import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

const { getPayload } = await import('payload')
const { GET } = await import('@/app/go/[slug]/route')

describe('go/[slug] API', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('redirects to destination with default UTM params', async () => {
    const find = vi.fn().mockResolvedValue({
      docs: [
        {
          destinations: [{ active: true, url: 'https://example.com', weight: 1 }],
        },
      ],
    })
    const findGlobal = vi.fn().mockResolvedValue({
      defaultUTMParams: [{ key: 'utm_source', value: 'test' }],
    })
    ;(getPayload as any).mockResolvedValue({ find, findGlobal })
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const req = new Request('http://localhost/go/example', {
      headers: { 'user-agent': 'Mozilla' },
    })
    const res = await GET(req, { params: { slug: 'example' } })

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://example.com/?utm_source=test')
  })

  it('returns 404 when product not found', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    ;(getPayload as any).mockResolvedValue({ find })

    const req = new Request('http://localhost/go/missing', {
      headers: { 'user-agent': 'Mozilla' },
    })
    const res = await GET(req, { params: { slug: 'missing' } })

    expect(res.status).toBe(404)
  })

  it('returns 404 when no active destinations', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [{ destinations: [{ active: false }] }] })
    ;(getPayload as any).mockResolvedValue({ find })

    const req = new Request('http://localhost/go/nodest', {
      headers: { 'user-agent': 'Mozilla' },
    })
    const res = await GET(req, { params: { slug: 'nodest' } })

    expect(res.status).toBe(404)
  })
})
