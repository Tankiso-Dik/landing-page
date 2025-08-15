import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React, { cache } from 'react'

// Types for product data returned from Payload
interface Product {
  slug: string
  title: string
  images?: { url: string; alt?: string }[]
  shortDescription?: string
  features?: { title: string; description: string }[]
  tags?: string[]
}

type Args = {
  params: Promise<{ slug?: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })

  if (!product) {
    return null
  }

  const relatedProducts = await queryRelatedProducts({
    tags: product.tags || [],
    slug: product.slug,
  })

  return (
    <article className="pt-16 pb-24">
      <Hero product={product} />
      <Carousel images={product.images} />
      <ShortDescription text={product.shortDescription} />
      <FeatureTrio features={product.features} />
      <PrimaryCTA slug={product.slug} />
      <RelatedProducts products={relatedProducts} />
      <StickyCTA slug={product.slug} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })
  return {
    title: product?.title,
  }
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return (result.docs?.[0] as Product) || null
})

const queryRelatedProducts = cache(async ({ tags, slug }: { tags: string[]; slug: string }) => {
  if (!tags.length) return [] as Product[]
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 3,
    pagination: false,
    where: {
      and: [
        { slug: { not_equals: slug } },
        { tags: { in: tags } },
      ],
    },
  })
  return result.docs as Product[]
})

function Hero({ product }: { product: Product }) {
  return (
    <section className="container">
      <h1 className="text-4xl font-bold text-center">{product.title}</h1>
    </section>
  )
}

function Carousel({ images = [] }: { images?: { url: string; alt?: string }[] }) {
  if (!images.length) return null
  return (
    <div className="mt-6 flex snap-x snap-mandatory overflow-x-auto gap-4">
      {images.map((img) => (
        <div key={img.url} className="snap-center shrink-0 w-full">
          <Image
            src={img.url}
            alt={img.alt || ''}
            width={800}
            height={600}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}

function ShortDescription({ text }: { text?: string }) {
  if (!text) return null
  return (
    <p className="container mt-8 text-lg text-center max-w-3xl">{text}</p>
  )
}

function FeatureTrio({ features = [] }: { features?: { title: string; description: string }[] }) {
  if (!features.length) return null
  return (
    <section className="container mt-12 grid gap-6 md:grid-cols-3">
      {features.slice(0, 3).map((feature, i) => (
        <div key={i} className="p-4 border rounded">
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </section>
  )
}

function PrimaryCTA({ slug }: { slug: string }) {
  return (
    <div className="container mt-12 text-center">
      <Link
        href={`/go/${slug}`}
        prefetch={false}
        className="inline-block rounded bg-blue-600 px-6 py-3 text-white"
      >
        Buy now
      </Link>
    </div>
  )
}

function RelatedProducts({ products = [] }: { products: Product[] }) {
  if (!products.length) return null
  return (
    <section className="container mt-16">
      <h2 className="text-2xl font-bold mb-6">Related products</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((p) => (
          <Link key={p.slug} href={`/p/${p.slug}`} className="block border rounded p-4">
            {p.title}
          </Link>
        ))}
      </div>
    </section>
  )
}

function StickyCTA({ slug }: { slug: string }) {
  return (
    <div className="sticky bottom-4 w-full flex justify-center">
      <Link
        href={`/go/${slug}`}
        prefetch={false}
        className="inline-block rounded bg-blue-600 px-6 py-3 text-white"
      >
        Buy now
      </Link>
    </div>
  )
}

