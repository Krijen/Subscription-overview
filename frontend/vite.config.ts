import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// ⚠️  Set this to match the URL shown in your backend terminal.
// When you run `dotnet run`, look for a line like:
//   "Now listening on: http://localhost:5182"
// Copy that URL here exactly (http vs https matters).
const BACKEND_URL = 'http://localhost:5000'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Subscription Overview',
        short_name: 'Subscriptions',
        description: 'Track and manage all your subscriptions',
        theme_color: '#5b7fff',
        background_color: '#0d0f14',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
})
