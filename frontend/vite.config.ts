import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ⚠️  Set this to match the URL shown in your backend terminal.
// When you run `dotnet run`, look for a line like:
//   "Now listening on: http://localhost:5182"
// Copy that URL here exactly (http vs https matters).
const BACKEND_URL = 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
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
