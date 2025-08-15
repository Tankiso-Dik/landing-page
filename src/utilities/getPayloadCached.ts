import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadCached = cache(async () => getPayload({ config: configPromise }))
