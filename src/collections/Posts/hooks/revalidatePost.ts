import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidate } from '@/hooks/revalidate'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (doc._status === 'published') {
    const path = `/p/${doc.slug}`
    revalidate({
      context,
      payload,
      path,
      tag: 'p-sitemap',
      logMessage: `Revalidating post at path: ${path}`,
    })
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/p/${previousDoc.slug}`
    revalidate({
      context,
      payload,
      path: oldPath,
      tag: 'p-sitemap',
      logMessage: `Revalidating old post at path: ${oldPath}`,
    })
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { payload, context },
}) => {
  const path = `/p/${doc?.slug}`
  revalidate({ context, payload, path, tag: 'p-sitemap' })

  return doc
}
