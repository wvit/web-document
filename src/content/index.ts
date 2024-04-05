import { Readability } from '@mozilla/readability'
import { Dom, styleToString, Message, Action } from '@/utils'

Message.content.on(
  Action.Content.GetPage,
  async (message, sender, sendResponse) => {
    const styles = Array.from(Dom.queryAll('style')).map(item => item.innerHTML)
    const documentClone = document.cloneNode(true) as any
    const result = new Readability(documentClone, {
      keepClasses: true,
    }).parse()

    for (const item of Dom.queryAll('link')) {
      if (item.attr('rel')?.includes('stylesheet')) {
        const css = await fetch(item.href).then(res => res.text())
        styles.push(css)
      }
    }

    console.log(111111, result)

    const pageContent = `
    <h2 
      style="${styleToString({
        'font-size': '24px',
      })}"
    >
      ${result?.title}
    </h2>

    ${result?.content}

    ${styles
      .map(item => `<style class="article-style">${item}</style>`)
      .join('')}

    <style> 
      body { 
        ${styleToString({
          padding: '16px',
          background: '#fff',
        })}
      } 
    </style>
    `

    sendResponse(pageContent)
  }
)
