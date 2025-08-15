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

  const limit = parseInt(searchParams.get('limit') ?? '50', 10)
  const page = parseInt(searchParams.get('page') ?? '1', 10)

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
}
