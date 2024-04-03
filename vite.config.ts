import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { buildEntry } = process.env

const allEntry = {
  content: {
    'content/index': 'src/content/index.ts',
  },
  background: {
    'background/index': 'src/background/index.ts',
  },
  action: {
    'action/index.html': 'src/action/index.html',
  },
}

/** 自定义当前需要构建哪些入口，减少开发中 build 时间 */
const input = (buildEntry || Object.keys(allEntry).join(','))
  .split(',')
  .reduce((prev, key) => ({ ...prev, ...allEntry[key] }), {})

export default defineConfig({
  root: 'src',

  publicDir: '../public',

  build: {
    outDir: '../dist',
    emptyOutDir: !buildEntry,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      input,
      output: {
        entryFileNames: `[name].js`,

        // assetFileNames: ({ name }: any) => {
        //   if (name.split('/').length > 1) {
        //     return `[name].[ext]`
        //   } else {
        //     return `assets/${name}`
        //   }
        // },
      },
    },
  },

  plugins: [
    react(),

    {
      name: 'rewrite-middleware',
      configureServer(serve) {
        serve.middlewares.use(async (req, res, next) => {
          await next()

          if (res.statusCode === 404) {
            /** 兼容 http://localhost/newtab/ 和 http://localhost/newtab/index.html 写法 */
            res.writeHead(302, {
              Location: path.join(req.url || '', 'index.html'),
            })

            res.end()
          }
        })
      },
    },
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 8000,
  },
})
