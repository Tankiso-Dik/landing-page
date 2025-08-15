import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'defaultUTMParams',
      label: 'Default UTM Params',
      type: 'array',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key-value pairs appended to outbound links as query parameters.',
      },
    },
  ],
}

export default SiteSettings
