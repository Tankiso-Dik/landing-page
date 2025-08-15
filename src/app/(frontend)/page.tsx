import React from 'react'

import { HomepageHero } from '@/components/(marketing)/HomepageHero'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 3,
    sort: 'featuredOrder',
    where: {
      featured: {
        equals: true,
      },
    },
  })

  const products = result.docs as any[]

  return (
    <div className="pt-24 pb-24">
      <HomepageHero products={products} />

      <section className="container mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = product.image || product?.meta?.image

          return (
            <article key={product.slug} className="text-center">
              {image && typeof image !== 'string' && (
                <Media
                  className="mx-auto w-full max-w-xs"
                  resource={image}
                  size="400px"
                />
              )}

              {product.title && (
                <h3 className="mt-4 text-xl font-semibold">{product.title}</h3>
              )}

              {product.slug && (
                <div className="mt-4 flex justify-center">
                  <Button asChild>
                    <Link prefetch={false} href={`/p/${product.slug}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}

export { generateMetadata } from './[slug]/page'

