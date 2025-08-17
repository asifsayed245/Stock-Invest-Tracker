import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No worker / Cloudflare plugins here.
// This is the simplest config that Netlify will build cleanly.
export default defineConfig({
  plugins: [react()]
})
