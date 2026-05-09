import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'author', type: 'string' }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'company', type: 'string' }),
    defineField({
      name: 'avatar',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: { select: { title: 'author', subtitle: 'company', media: 'avatar' } },
});
