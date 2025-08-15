import { notFound } from 'next/navigation'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { CardPostData } from '@/components/Card'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{ page?: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { page: pageParam = '1' } = await paramsPromise
  const page = parseInt(pageParam, 10)

  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    page,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  })

  if (page > products.totalPages) notFound()

  return (
    <div className="pt-24 pb-24">
      <CollectionArchive posts={products.docs as CardPostData[]} relationTo="products" />
      <Pagination page={page} totalPages={products.totalPages} />
    </div>
  )
}
