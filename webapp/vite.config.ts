import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src/main/javascript/app', import.meta.url)),
      '@componente': fileURLToPath(new URL('./src/main/javascript/componente', import.meta.url)),
      '@dominio': fileURLToPath(new URL('./src/main/javascript/dominio', import.meta.url)),
      '@pagina': fileURLToPath(new URL('./src/main/javascript/pagina', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/main/javascript/assets', import.meta.url)),
    },
  },
})
