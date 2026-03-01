import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'dzwkyk-5173.csb.app',
      '.csb.app',
      'localhost',
    ],
  },
})
