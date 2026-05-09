/*
  Schema registry. Add new types here so Sanity Studio picks them up.
*/
import { seo } from './blocks/seo';
import { blockContent } from './blocks/portableText';
import { siteSettings } from './siteSettings';
import { homeContent } from './homeContent';
import { aboutContent } from './aboutContent';
import { service } from './service';
import { project } from './project';
import { blogPost } from './blogPost';
import { testimonial } from './testimonial';

export const schemaTypes = [
  // Reusable blocks
  seo,
  blockContent,
  // Documents
  siteSettings,
  homeContent,
  aboutContent,
  service,
  project,
  blogPost,
  testimonial,
];
