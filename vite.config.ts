import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  /* self add */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.d.ts', '.jsx', '.tsx', '.json'],
  }
})
