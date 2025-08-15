import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { getServerSideURL } from '@/utilities/getURL'

export const runtime = 'nodejs'

const BOT_REGEX = /bot|crawl|spider|slurp|fetch|crawler/i

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
): Promise<Response> {
  const { slug } = params
  const payload = await getPayload({ config: configPromise })
  try {
    const { docs } = await payload.find<{ destinations?: any[] }>({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    const product = docs?.[0]

    if (!product) {
      return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
    }

    const destinations = (product.destinations || []).filter((d: any) => d.active)

    if (!destinations.length) {
      return new Response('No destinations', { status: 404, headers: { 'Cache-Control': 'no-store' } })
    }

    const siteSettings = await payload.findGlobal<{ defaultUTMParams?: { key: string; value: string }[] }>({
      slug: 'site-settings',
    })

    const utmParams: Record<string, string> = {}
    siteSettings?.defaultUTMParams?.forEach(({ key, value }) => {
      utmParams[key] = value
    })

    const totalWeight = destinations.reduce(
      (sum: number, d: any) => sum + (typeof d.weight === 'number' ? d.weight : 0),
      0,
    )

    let threshold = Math.random() * totalWeight
    let chosen = destinations[0]
    for (const d of destinations) {
      threshold -= typeof d.weight === 'number' ? d.weight : 0
      if (threshold <= 0) {
        chosen = d
        break
      }
    }

    const destURL = new URL(chosen.url)
    Object.entries(utmParams).forEach(([key, value]) => {
      destURL.searchParams.append(key, value)
    })

    const ua = req.headers.get('user-agent') || ''
    if (BOT_REGEX.test(ua)) {
      const productURL = new URL(`/products/${slug}`, getServerSideURL())
      const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${productURL.toString()}"></head><body></body></html>`
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    return NextResponse.redirect(destURL.toString(), {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }
}
