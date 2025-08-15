export interface Product {
  slug: string
  title: string
  images?: { url: string; alt?: string }[]
  shortDescription?: string
  features?: { title: string; description: string }[]
  tags?: string[]
  categories?: { title?: string }[]
  heroImage?: unknown
  image?: unknown
  meta?: { image?: unknown }
}
