import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  studioHost: 'devanshpatel-portfolio',
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '2gm1jzpw',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
