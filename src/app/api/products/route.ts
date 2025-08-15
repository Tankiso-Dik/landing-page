import type { NextRequest } from 'next/server'
import { getPayloadCached } from '@/utilities/getPayloadCached'

export const runtime = 'nodejs'

const select = {
  slug: true,
  listingName: true,
  summary: true,
  heroImage: true,
}

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayloadCached()
  const { searchParams } = new URL(req.url)

  const limitParam = searchParams.get('limit')
  const pageParam = searchParams.get('page')

  let limit = 50
  let page = 1

  if (limitParam !== null) {
    const parsed = parseInt(limitParam, 10)
    if (Number.isNaN(parsed) || parsed < 1) {
      return Response.json(
        { error: 'Invalid "limit" query parameter' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      )
    }
    limit = Math.min(parsed, 100)
  }

  if (pageParam !== null) {
    const parsed = parseInt(pageParam, 10)
    if (Number.isNaN(parsed) || parsed < 1) {
      return Response.json(
        { error: 'Invalid "page" query parameter' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      )
    }
    page = parsed
  }

  try {
    const products = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit,
      page,
      select,
    })

    return Response.json(
      {
        docs: products.docs,
        totalDocs: products.totalDocs,
        totalPages: products.totalPages,
        page: products.page,
        limit: products.limit,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch (err) {
    return Response.json(
      { error: 'Failed to fetch products' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}
