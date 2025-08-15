/**
 * Builds the pages sitemap using paginated queries to avoid limiting results
 * to 1000 entries.
 */
import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'
import { getPayloadCached } from '@/utilities/getPayloadCached'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayloadCached()
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const allPages: { slug?: string; updatedAt?: string }[] = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const result = await payload.find({
        collection: 'pages',
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

      allPages.push(...result.docs)
      hasNextPage = result.hasNextPage
      page += 1
    }

    const dateFallback = new Date().toISOString()

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/p`,
        lastmod: dateFallback,
      },
    ]

    const sitemap = allPages
      .filter((page) => Boolean(page?.slug))
      .map((page) => ({
        loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
        lastmod: page.updatedAt || dateFallback,
      }))

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
