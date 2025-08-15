# React 19 Compatibility

The following table lists peer dependency requirements for key UI packages and Payload plugins used in this project.

| Package | Relevant peer dependencies | React 19 support |
| --- | --- | --- |
| @radix-ui/react-checkbox | react ^16.8 \\|\| ^17.0 \\|\| ^18.0 \\|\| ^19.0; react-dom same | ✅ |
| @radix-ui/react-label | react ^16.8 \\|\| ^17.0 \\|\| ^18.0 \\|\| ^19.0; react-dom same | ✅ |
| @radix-ui/react-select | react ^16.8 \\|\| ^17.0 \\|\| ^18.0 \\|\| ^19.0; react-dom same | ✅ |
| @radix-ui/react-slot | react ^16.8 \\|\| ^17.0 \\|\| ^18.0 \\|\| ^19.0 | ✅ |
| @payloadcms/admin-bar | react ^16.8.0 \\|\| ^17.0.0 \\|\| ^18.0.0 \\|\| ^19.0.0; react-dom same | ✅ |
| @payloadcms/live-preview-react | react ^16.8.0 \\|\| ^17.0.0 \\|\| ^18.0.0 \\|\| ^19.0.0; react-dom same | ✅ |
| @payloadcms/plugin-form-builder | react ^19.0.0 (includes rc); react-dom same | ✅ |
| @payloadcms/plugin-seo | react ^19.0.0 (includes rc); react-dom same | ✅ |
| @payloadcms/richtext-lexical | react ^19.0.0 (includes rc); react-dom same | ✅ |
| @payloadcms/ui | react ^19.0.0 (includes rc); react-dom same | ✅ |
| Other Payload plugins (db-vercel-postgres, payload-cloud, plugin-nested-docs, plugin-redirects, plugin-search, storage-vercel-blob) | No React peer dependency | N/A |

**Summary:** All checked packages already declare compatibility with React 19. No upgrades or alternatives are required at this time.
