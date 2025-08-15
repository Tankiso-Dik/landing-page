import React from 'react'

import type { Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'

export interface ProductHeroProps {
  title: string
  heroImage?: Media | string | null
}

export const ProductHero: React.FC<ProductHeroProps> = ({ title, heroImage }) => {
  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative pb-8">
        <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
      </div>
      <div className="min-h-[40vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <MediaComponent fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
