import { Readability } from '@mozilla/readability'
import { Dom, styleToString } from '@/utils'

window.addEventListener('load', async () => {
  const styles = Array.from(Dom.queryAll('style')).map(item => item.innerHTML)
  const documentClone = document.cloneNode(true) as any
  const result = new Readability(documentClone, {
    keepClasses: true,
  }).parse()

  console.log(11111, result)

  for (const item of Dom.queryAll('link')) {
    if (item.attr('rel')?.includes('stylesheet')) {
      const css = await fetch(item.href).then(res => res.text())
      styles.push(css)
    }
  }

  const iframeContent = `
  <h2 
    style="${styleToString({
      'font-size': '24px',
    })}"
  >
    ${result?.title}
  </h2>

  ${result?.content}

  ${styles.map(item => `<style class="article-style">${item}</style>`).join('')}

  <style> 
    body { 
      ${styleToString({
        padding: '16px',
        background: '#fff',
      })}
    } 
  </style>
  `

  Dom.query('body').create('iframe', {
    style: styleToString({
      position: 'fixed',
      right: 0,
      bottom: 0,
      border: '1px solid red',
      width: '50vw',
      height: '50vh',
      'z-index': 999,
    }),
    srcdoc: iframeContent,
  })
})
