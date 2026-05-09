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
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'summary' } },
});
