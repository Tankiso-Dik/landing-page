import type { Media } from '@/payload-types'

type ProductArgs = {
  heroImage: Media
  galleryImages: Media[]
}

export const product2 = ({ heroImage, galleryImages }: ProductArgs) => {
  return {
    slug: 'mountain-bike',
    _status: 'published',
    title: 'Mountain Bike',
    listingName: 'Mountain Bike',
    summary: 'A rugged bike for off-road adventures.',
    shortDescription: 'Conquer mountains with this high-performance bike.',
    heroImage: heroImage.id,
    image: heroImage.id,
    gallery: galleryImages.map((img) => ({ image: img.id })),
    features: [
      { title: 'Durable Frame', description: 'Built to handle the toughest trails.' },
      { title: 'Smooth Suspension', description: 'Ride in comfort over any terrain.' },
      { title: 'Hydraulic Brakes', description: 'Stop on a dime with high-end brakes.' },
    ],
    destinations: [
      { label: 'Buy on Example', url: 'https://example.com/mountain-bike', weight: 1, active: true },
    ],
    tags: ['sports', 'outdoors'],
    featured: true,
    featuredOrder: 2,
  }
}

