/*
  Reusable SEO field group. Embed in any document type via:
    defineField({ name: 'seo', type: 'seo' })
*/
import { defineType, defineField } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsed: true, collapsible: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the default title in <title>. Keep under 60 characters.',
      validation: (rule) => rule.max(70).warning('Titles longer than 70 chars get truncated by Google.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Shown in search results and social shares. 120-160 characters is the sweet spot.',
      validation: (rule) => rule.max(200).warning('Long descriptions get truncated.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image (1200x630)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
