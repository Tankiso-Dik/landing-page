import type { CollectionBeforeChangeHook } from 'payload'

export const cleanProduct: CollectionBeforeChangeHook = ({ data }) => {
  if (Array.isArray(data?.gallery) && data.gallery.length === 0) {
    data.gallery = undefined
  }
  if (Array.isArray(data?.features) && data.features.length === 0) {
    data.features = undefined
  }
  return data
}
