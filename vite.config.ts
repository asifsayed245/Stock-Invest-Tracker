import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
    // NOTE: do NOT externalize 'react-is' – it must be bundled
  }
})
