import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path + (path.includes('?') ? '&' : '?') + '__ngrok_skip_browser_warning=true',
        headers: {
          'User-Agent': 'Vite-Proxy/1.0'
        }
      }
    }
  }
})
