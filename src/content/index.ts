import { Readability } from '@mozilla/readability'
import { Dom, styleToString, Message, Action } from '@/utils'

singlefile.init(fetch)

/** 获取当前页面信息 */
const getPageData = async () => {
  const { content, title } = await singlefile.getPageData({
    removeHiddenElements: true,
    removeUnusedStyles: true,
    removeUnusedFonts: true,
    removeImports: true,
    blockScripts: true,
    blockAudios: true,
    blockVideos: true,
    compressHTML: true,
    removeAlternativeFonts: true,
    removeAlternativeMedias: true,
    removeAlternativeImages: true,
    groupDuplicateImages: true,
  })
  const htmlDocument = document.implementation.createHTMLDocument('')
  htmlDocument.write(content)
  const textContent = Dom.query('body', htmlDocument).textContent?.replace(
    /\s+/g,
    ' '
  )

  return {
    htmlDocument,
    pageData: { title, textContent, htmlContent: content, href: location.href },
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
        <h2
          style="${styleToString({
            'font-size': '24px',
          })}"
        >
          ${pageData.title}
        </h2>
        ${content}
      </div>

      <style>
        body {
          ${styleToString({
            padding: '16px',
            background: '#fff',
          })}
        }
      </style>
      `

    console.log(111111, pageData, content)

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
