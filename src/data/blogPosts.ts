import type { BlogPost } from '../types/content';

export const blogPosts: BlogPost[] = [
  {
    _id: 'b1',
    slug: 'why-i-still-write-css-by-hand',
    title: 'Why I still write CSS by hand (with Tailwind)',
    excerpt:
      'Utility classes get a bad rap. Here is the workflow that made them click for me.',
    body: [
      'When I first met Tailwind I bounced off it hard. Long class strings felt like a regression. I had spent years naming things and now I was supposed to spray utilities everywhere?',
      'What changed my mind was the feedback loop. With Tailwind I rarely leave the file I am working on. There is no second mental model: what I see is what gets shipped.',
      'The trick is to lean on @apply for genuinely reused patterns and to extract a real component the moment a class string starts repeating in three places.',
    ],
    tags: ['CSS', 'Tailwind'],
    publishedAt: '2026-04-12',
    readingMinutes: 4,
  },
  {
    _id: 'b2',
    slug: 'a-tiny-design-system-in-an-afternoon',
    title: 'A tiny design system in an afternoon',
    excerpt:
      'Five primitives, one tokens file, and a lot of willingness to delete code.',
    body: [
      'You do not need 80 components. You need five good ones, and you need everyone to actually use them.',
      'Start with: Button, Input, Card, Badge, Section. That covers 80% of any marketing or product surface.',
      'Tokens come next. Pick a color scale, a spacing scale, a radius scale. Write them in one file. Refer to them everywhere.',
    ],
    tags: ['Design Systems', 'React'],
    publishedAt: '2026-03-02',
    readingMinutes: 6,
  },
  {
    _id: 'b3',
    slug: 'reading-the-job-description-twice',
    title: 'Reading the job description twice',
    excerpt:
      'A small habit that has saved me from a lot of bad applications.',
    body: [
      'Most job descriptions are written by someone who is also doing eleven other things. The first read tells you what the role nominally is. The second read tells you what the team actually wants.',
      'Look for verbs. "Build" and "ship" mean execution. "Influence" and "partner" mean the role is more political. Both are fine, but they need different cover letters.',
    ],
    tags: ['Career'],
    publishedAt: '2026-02-19',
    readingMinutes: 3,
  },
];
