import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    /*
      Split the bundle into named chunks so the browser can fetch and parse
      them in parallel. Each chunk is also independently cached — when you
      push a code change only the chunk that changed gets re-downloaded.

      Before: one 131 KiB index-xxx.js that blocks the main thread.
      After:  four smaller files, none over ~50 KiB, parsed concurrently.
    */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@sanity')) {
            return 'vendor-sanity';
          }
          return undefined;
        },
      },
    },
  },
})
