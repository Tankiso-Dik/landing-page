import Link from 'next/link'
import React from 'react'

interface Product {
  slug: string
  title: string
}

export const RelatedProducts: React.FC<{ products?: Product[] }> = ({ products = [] }) => {
  if (!products.length) return null

  return (
    <section className="container mt-16">
      <h2 className="text-2xl font-bold mb-6">Related products</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <Link key={product.slug} href={`/p/${product.slug}`} className="block border rounded p-4">
            {product.title}
          </Link>
        ))}
      </div>
    </section>
  )
}

