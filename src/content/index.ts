import { create, insert } from '@orama/orama'
import { populateFromGlob, defaultHtmlSchema } from '@orama/plugin-parsedoc'
import { Dom } from '@/utils'

const db = await create({
  schema: defaultHtmlSchema,
})

await populateFromGlob(db, 'docs/**/*.html')


window.addEventListener('load', async () => {
  const html = Dom.create('html')

  html.innerHTML = Dom.query('html').innerHTML || ''

  Dom.queryAll('script', html).forEach(item => {
    item.remove()
  })

  Dom.queryAll('img', html).forEach(item => {
    item.remove()
  })

  Dom.queryAll('video', html).forEach(item => {
    item.remove()
  })

  Dom.queryAll('svg', html).forEach(item => {
    item.remove()
  })

  for (const item of Dom.queryAll('link', html)) {
    item.remove()

    if (item.attr('rel')?.includes('stylesheet')) {
      const css = await fetch(item.href).then(res => res.text())
      html.create('style', { innerHTML: css })
    }
  }

//   Dom.query('body').create('iframe', {
//     style:
//       'position:fixed;left:50px;top:50px; border:1px solid red; width:70vw;height:70vh;background:#fff;z-index:999;',
//     srcdoc: html.innerHTML,
//   })

  console.log(11111, html.innerHTML)
})
