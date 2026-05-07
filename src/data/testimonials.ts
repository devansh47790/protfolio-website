import type { Testimonial } from '../types/content';

export const testimonials: Testimonial[] = [
  {
    _id: 't1',
    quote:
      'Devansh shipped our marketing site in two weeks and it has held up for a year without a single tweak.',
    author: 'A. Rivera',
    role: 'Head of Marketing',
    company: 'Acme Co.',
  },
  {
    _id: 't2',
    quote:
      'Clean code, clean designs, and pleasantly low drama. We trusted him with the whole frontend.',
    author: 'M. Tanaka',
    role: 'Engineering Manager',
    company: 'Northwind',
  },
  {
    _id: 't3',
    quote:
      'He found three accessibility regressions our QA missed. Detail-oriented in the best way.',
    author: 'P. Dubois',
    role: 'Product Designer',
    company: 'Studio Mira',
  },
];
