import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import { i18n } from '@vorker/chrome'
import { locales } from './src/locales'

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

  plugins: [
    i18n.generateLocales(locales, (key, content) => {
      try {
        fs.writeFileSync(`public/_locales/${key}/messages.json`, content)
        fs.writeFileSync(`dist/_locales/${key}/messages.json`, content)
      } catch {}
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
