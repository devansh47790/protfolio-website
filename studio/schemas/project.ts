import { defineType, defineField } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['React', 'WooCommerce', 'WordPress Custom Theme', 'Company Portfolio'] },
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'coverColor',
      title: 'Cover gradient (Tailwind)',
      type: 'string',
      description: 'Used as a fallback when no image is set, e.g. from-charcoal-700 to-charcoal-900',
    }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'liveUrl', type: 'url' }),
    defineField({ name: 'repoUrl', type: 'url' }),
    defineField({ name: 'date', type: 'date' }),

    /* Long-form case study */
    defineField({ name: 'problem', type: 'text', rows: 3 }),
    defineField({ name: 'approach', type: 'array', of: [{ type: 'text', rows: 2 }] }),
    defineField({ name: 'outcomes', type: 'array', of: [{ type: 'text', rows: 2 }] }),

    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [{ title: 'Date, newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
});
