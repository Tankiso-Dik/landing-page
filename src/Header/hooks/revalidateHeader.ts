import type { GlobalAfterChangeHook } from 'payload'

import { revalidate } from '@/hooks/revalidate'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  revalidate({
    context,
    payload,
    tag: 'global_header',
    logMessage: 'Revalidating header',
  })

  return doc
}
