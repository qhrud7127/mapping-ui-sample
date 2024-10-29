import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/dna/api': {
        target: 'http://localhost:8070',
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
