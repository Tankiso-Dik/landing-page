import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { CardPostData } from '@/components/Card'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
  title: 'Products',
}

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    page: 1,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <CollectionArchive posts={products.docs as CardPostData[]} relationTo="products" />
      {products.totalPages > 1 && (
        <Pagination page={1} totalPages={products.totalPages} />
      )}
    </div>
  )
}
