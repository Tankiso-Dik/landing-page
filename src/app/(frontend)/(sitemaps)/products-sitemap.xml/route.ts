/**
 * Builds the products sitemap with paginated queries, removing the fixed
 * 1000-item cap.
 */
import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'
import { assertEnv } from '@/utilities/assertEnv'
import { getPayloadCached } from '@/utilities/getPayloadCached'

// Ensure required env variables are present before running
assertEnv(['NEXT_PUBLIC_SERVER_URL', 'VERCEL_PROJECT_PRODUCTION_URL'])

const getProductsSitemap = unstable_cache(
  async () => {
    const payload = await getPayloadCached()
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const allProducts: { slug?: string; updatedAt?: string }[] = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const result = await payload.find({
        collection: 'products',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 100,
        page,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      allProducts.push(...result.docs)
      hasNextPage = result.hasNextPage
      page += 1
    }

    const dateFallback = new Date().toISOString()

    const sitemap = allProducts
      .filter((product) => Boolean(product?.slug))
      .map((product) => ({
        loc: `${SITE_URL}/p/${product?.slug}`,
        lastmod: product.updatedAt || dateFallback,
      }))

    return sitemap
  },
  ['products-sitemap'],
  {
    tags: ['products-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getProductsSitemap()
  return getServerSideSitemap(sitemap)
}
