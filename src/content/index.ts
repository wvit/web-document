import { Readability } from '@mozilla/readability'
import { Dom, styleToString, Message, Action } from '@/utils'

singlefile.init({
  fetch: async (url, options) => {
    console.log(11111, url)
    return fetch(url, options)
  },
})

/** 获取当前页面信息 */
const getPageData = async () => {
  const singlefileData = await singlefile.getPageData({
    removeHiddenElements: true,
    removeUnusedStyles: true,
    removeUnusedFonts: true,
    removeFrames: true,
    removeImports: true,
    removeAlternativeFonts: true,
    removeAlternativeMedias: true,
    removeAlternativeImages: true,
    blockScripts: true,
    blockAudios: true,
    blockVideos: true,
    compressHTML: true,
    groupDuplicateImages: true,
  })
  const { content, title } = singlefileData
  const htmlDocument = document.implementation.createHTMLDocument('')
  htmlDocument.write(content)
  const body = Dom.query('body', htmlDocument.cloneNode(true) as Document)

  Dom.queryAll('style', body).forEach(item => item.remove())
  Dom.queryAll('link', body).forEach(item => item.remove())
  Dom.queryAll('script', body).forEach(item => item.remove())

  return {
    htmlDocument,
    pageData: {
      title,
      textContent: body.textContent?.replace(/\s+/g, ' '),
      htmlContent: content,
      href: location.href,
      host: location.host,
    },
  }
}

/** 监听获取当前页面文章 */
Message.content.on(
  Action.Content.GetArticle,
  async (message, sender, sendResponse) => {
    const { htmlDocument, pageData } = await getPageData()
    const { content, textContent } = new Readability(htmlDocument, {
      keepClasses: true,
    }).parse()!
    const htmlContent = `
      <div>
        <h1 style="${styleToString({
          'font-size': '24px',
        })}" >
          ${pageData.title}
        </h1>
        ${content}
      </div>
      <style>
        body{${styleToString({
          padding: '12px',
          background: '#fff',
        })}}
      </style>
      `

    sendResponse({ ...pageData, htmlContent, textContent })
  }
)

/** 监听获取当前页面全部内容 */
Message.content.on(
  Action.Content.GetPage,
  async (message, sender, sendResponse) => {
    const { pageData } = await getPageData()

    sendResponse(pageData)
  }
)
