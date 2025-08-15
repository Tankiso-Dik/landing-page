import type { GlobalAfterChangeHook } from 'payload'

import { revalidate } from '@/hooks/revalidate'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  revalidate({
    context,
    payload,
    tag: 'global_footer',
    logMessage: 'Revalidating footer',
  })

  return doc
}
