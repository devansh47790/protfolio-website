/*
  Sanity Studio configuration.

  - Reads project ID + dataset from environment, OR you can hardcode here.
  - Uses the structureTool (default content browser) and visionTool (GROQ playground).
  - Schemas live under ./schemas — see ./schemas/index.ts.

  After your `npm create sanity@latest` run gives you a projectId, paste it
  into the constants below or set SANITY_STUDIO_PROJECT_ID in your env.
*/
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '2gm1jzpw';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'portfolio',
  title: 'Devansh Patel — Portfolio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});

