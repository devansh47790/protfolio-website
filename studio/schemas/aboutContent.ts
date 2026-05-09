import { defineType, defineField } from 'sanity';

export const aboutContent = defineType({
  name: 'aboutContent',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({ name: 'intro', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({
      name: 'story',
      title: 'Story (paragraphs)',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
    }),
    defineField({
      name: 'skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'timeline',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'year', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'text', rows: 2 },
        ],
      }],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { subtitle: 'intro' }, prepare: ({ subtitle }) => ({ title: 'About page', subtitle }) },
});
