import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'ownerName', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.email() }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({
      name: 'siteUrl',
      title: 'Production URL',
      type: 'url',
      description: 'Used for canonical links and the sitemap.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'socials',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'href', type: 'url' },
        ],
      }],
    }),
    defineField({ name: 'resumeUrl', title: 'Résumé URL', type: 'string' }),
    defineField({ name: 'defaultOgImage', title: 'Default social share image', type: 'image' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'ownerName', subtitle: 'tagline' } },
});
