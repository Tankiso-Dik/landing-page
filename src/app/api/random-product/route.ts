import { getPayload } from 'payload'
import config from '@payload-config'

export const runtime = 'nodejs'

const select = {
  slug: true,
  listingName: true,
  summary: true,
  heroImage: true,
  destinations: true,
}

function pickWeightedDestination(destinations: any[]): any | undefined {
  const total = destinations.reduce((sum, d) => sum + (d?.weight || 0), 0)
  if (total === 0) return undefined
  const r = Math.random() * total
  let acc = 0
  for (const dest of destinations) {
    acc += dest?.weight || 0
    if (r < acc) return dest
  }
  return destinations[0]
}

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    pagination: false,
    select,
  })

  if (!products.docs.length) {
    return Response.json(null, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }

  const product = products.docs[Math.floor(Math.random() * products.docs.length)] as any

  const destination = pickWeightedDestination(product.destinations || [])

  const result = {
    slug: product.slug,
    listingName: product.listingName,
    summary: product.summary,
    heroImage: product.heroImage,
    destination,
  }

  return Response.json(result, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
