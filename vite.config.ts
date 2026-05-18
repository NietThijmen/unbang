import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Keep Vite's static public directory explicit for clarity.
  publicDir: 'public',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['opensearch.xml', 'favicon.svg', 'robots.txt'],
    }),
  ],
})
