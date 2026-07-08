import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/tjl-test3/',
  plugins: [vue()],
  server: {
    port: 5176,
    strictPort: true,
  },
})
