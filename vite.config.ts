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
        manualChunks: {
          // React core — almost never changes, long-cached
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Framer Motion is large (~35 KiB gz) but only needed for animations
          'vendor-motion': ['framer-motion'],
          // Sanity client only needed once CMS data is fetched
          'vendor-sanity': ['@sanity/client', '@sanity/image-url'],
        },
      },
    },
  },
})
