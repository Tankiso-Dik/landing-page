'use client'

import { Media } from '@/components/Media'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

type Product = {
  slug?: string
  title?: string
  image?: any
  meta?: {
    image?: any
  }
}

export const HomepageHero: React.FC<{ products: Product[] }> = ({ products }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!products || products.length < 2) return

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [products])

  const current = products[index]
  const image = current?.image || current?.meta?.image

  return (
    <div className="relative h-96 w-full overflow-hidden">
      <AnimatePresence initial={false}>
        {image && typeof image !== 'string' && (
          <motion.div
            key={current?.slug || index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Media fill imgClassName="object-cover" resource={image} />
          </motion.div>
        )}
      </AnimatePresence>
      {current?.title && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-4xl font-bold text-white">{current.title}</h1>
        </div>
      )}
    </div>
  )
}

export default HomepageHero

