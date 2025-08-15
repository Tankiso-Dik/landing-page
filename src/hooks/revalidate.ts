import { revalidatePath, revalidateTag } from 'next/cache'
import type { Payload } from 'payload'

interface RevalidateOptions {
  context?: {
    disableRevalidate?: boolean
  }
  payload?: Payload
  tag?: string | string[]
  path?: string | string[]
  logMessage?: string
}

export const revalidate = ({
  context,
  payload,
  tag,
  path,
  logMessage,
}: RevalidateOptions): void => {
  if (context?.disableRevalidate) {
    return
  }

  if (logMessage && payload) {
    payload.logger.info(logMessage)
  }

  if (tag) {
    const tags: string[] = Array.isArray(tag) ? tag : [tag]
    tags.forEach((t) => revalidateTag(t))
  }

  if (path) {
    const paths: string[] = Array.isArray(path) ? path : [path]
    paths.forEach((p) => revalidatePath(p))
  }
}

export default revalidate
