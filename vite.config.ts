import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      transformAssetUrls: {
        includeAbsolute: false,
      }
    }
  })],
  css: {
    preprocessorOptions: {
      sass: {}
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
