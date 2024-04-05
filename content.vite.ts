import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',

  publicDir: '../public',

  build: {
    outDir: '../dist',

    emptyOutDir: false,

    reportCompressedSize: false,

    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      input: 'src/content/index.ts',
      output: {
        entryFileNames: `content/[name].js`,
        format: 'iife',
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
