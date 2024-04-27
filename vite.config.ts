import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { entry } = process.env

const allEntry = {
  background: {
    'background/index': 'src/background/index.ts',
  },
  action: {
    'action/index.html': 'src/action/index.html',
  },
  page: {
    'page/index.html': 'src/page/index.html',
  },
}

/** 自定义当前需要构建哪些入口，减少开发中 build 时间 */
const input = (entry || Object.keys(allEntry).join(','))
  .split(',')
  .reduce((prev, key) => ({ ...prev, ...allEntry[key] }), {})

export default defineConfig({
  root: 'src',

  publicDir: '../public',

  build: {
    outDir: '../dist',

    emptyOutDir: false,

    reportCompressedSize: false,

    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      input,
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
