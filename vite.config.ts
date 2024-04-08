import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',

  publicDir: '../public',

  build: {
    outDir: '../dist',

    emptyOutDir: false,

    reportCompressedSize: false,

    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      input: {
        'background/index': 'src/background/index.ts',
        'action/index.html': 'src/action/index.html',
        'page/index.html': 'src/page/index.html',
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
