import type { Media } from '@/payload-types'

type ProductArgs = {
  heroImage: Media
  galleryImages: Media[]
}

export const product1 = ({ heroImage, galleryImages }: ProductArgs) => {
  return {
    slug: 'acme-camera',
    _status: 'published',
    title: 'ACME Camera',
    listingName: 'ACME Camera',
    summary: 'Capture moments with the ACME Camera.',
    shortDescription: 'A compact digital camera with advanced features.',
    heroImage: heroImage.id,
    image: heroImage.id,
    gallery: galleryImages.map((img) => ({ image: img.id })),
    features: [
      { title: 'Crystal Clear Lens', description: 'Shoots in stunning 8K resolution.' },
      { title: 'Long Battery Life', description: 'Keep shooting for up to 24 hours.' },
      { title: 'Lightweight Design', description: 'Carry it anywhere with ease.' },
    ],
    destinations: [
      { label: 'Buy on ACME', url: 'https://example.com/acme-camera', weight: 1, active: true },
    ],
    tags: ['photography', 'electronics'],
    featured: true,
    featuredOrder: 1,
  }
}

