import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidate } from '@/hooks/revalidate'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    revalidate({
      context,
      payload,
      path,
      tag: 'pages-sitemap',
      logMessage: `Revalidating page at path: ${path}`,
    })
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
    revalidate({
      context,
      payload,
      path: oldPath,
      tag: 'pages-sitemap',
      logMessage: `Revalidating old page at path: ${oldPath}`,
    })
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { payload, context },
}) => {
  const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
  revalidate({ context, payload, path, tag: 'pages-sitemap' })

  return doc
}
