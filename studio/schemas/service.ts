import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 2 }),
    defineField({
      name: 'icon',
      type: 'string',
      options: { list: ['code', 'layers', 'database', 'gauge'] },
    }),
    defineField({
      name: 'bullets',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
    }),
    defineField({
      name: 'robots',
      title: 'Robots',
      type: 'string',
      options: {
        list: ['index, follow', 'noindex, follow', 'noindex, nofollow'],
      },
      initialValue: 'index, follow',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph title',
      type: 'string',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'targetKeywords',
      title: 'Target keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'h1',
      title: 'H1',
      type: 'string',
    }),
    defineField({
      name: 'hero',
      title: 'Hero copy',
      type: 'blockContent',
    }),
    defineField({
      name: 'ctaLinks',
      title: 'CTA links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Body sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'blockContent' }),
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'answer', type: 'text', rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        },
      ],
    }),
    defineField({
      name: 'schemaJson',
      title: 'JSON-LD schema',
      type: 'text',
      rows: 12,
      description: 'Raw JSON-LD object without the surrounding script tag.',
    }),
    defineField({
      name: 'internalLinks',
      title: 'Internal links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'href', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'externalLinks',
      title: 'External links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'href', type: 'url' }),
            defineField({ name: 'note', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'summary' } },
});
