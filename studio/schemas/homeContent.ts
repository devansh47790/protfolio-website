import { defineType, defineField } from 'sanity';

export const homeContent = defineType({
  name: 'homeContent',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({ name: 'heroEyebrow', type: 'string' }),
    defineField({ name: 'heroHeadline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'heroSubhead', type: 'text', rows: 3 }),
    defineField({
      name: 'primaryCta',
      type: 'object',
      fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }],
    }),
    defineField({
      name: 'secondaryCta',
      type: 'object',
      fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }],
    }),
    defineField({
      name: 'highlightStats',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'value', type: 'string' },
        ],
      }],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'heroHeadline' } },
});
