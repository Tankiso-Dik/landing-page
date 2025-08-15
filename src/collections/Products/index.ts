import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { cleanProduct } from './hooks/cleanProduct'
import { revalidateDelete, revalidateProduct } from './hooks/revalidateProduct'

const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]*$/

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['listingName', 'slug', 'updatedAt'],
    useAsTitle: 'listingName',
  },
  fields: [
    {
      name: 'listingName',
      type: 'text',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'destinations',
              type: 'array',
              validate: (value) => {
                if (Array.isArray(value) && value.some((d) => d.active)) return true
                return 'At least one destination must be active'
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: (val: string) => {
                    if (!val || urlRegex.test(val)) return true
                    return 'Invalid URL'
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'weight',
                  type: 'number',
                  required: true,
                  min: 1,
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [({ siblingData, value }) => {
          if (siblingData._status === 'published' && !value) {
            return new Date()
          }
          return value
        }],
      },
    },
    ...slugField('listingName'),
  ],
  hooks: {
    beforeChange: [cleanProduct],
    afterChange: [revalidateProduct],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
