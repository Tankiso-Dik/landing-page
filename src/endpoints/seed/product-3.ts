import type { Media } from '@/payload-types'

type ProductArgs = {
  heroImage: Media
  galleryImages: Media[]
}

export const product3 = ({ heroImage, galleryImages }: ProductArgs) => {
  return {
    slug: 'smart-watch',
    _status: 'published',
    title: 'Smart Watch',
    listingName: 'Smart Watch',
    summary: 'Stay connected on the go.',
    shortDescription: 'A sleek smartwatch with all-day battery life.',
    heroImage: heroImage.id,
    image: heroImage.id,
    gallery: galleryImages.map((img) => ({ image: img.id })),
    features: [
      { title: 'Heart Rate Monitor', description: 'Track your health metrics in real time.' },
      { title: 'Water Resistant', description: 'Wear it in the shower or pool.' },
      { title: 'App Ecosystem', description: 'Access thousands of apps from your wrist.' },
    ],
    destinations: [
      { label: 'Buy on Example', url: 'https://example.com/smart-watch', weight: 1, active: true },
    ],
    tags: ['electronics', 'wearables'],
    featured: true,
    featuredOrder: 3,
  }
}

