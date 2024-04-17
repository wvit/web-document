import { Readability } from '@mozilla/readability'
import { dom, styleToString, Message, Action, getStorageSize } from '@/utils'

/** 重写 singleFile 的 fetch 资源方法 */
const getRequest = domain => {
  return async (url, requestOptions) => {
    const resourceType = url.split('?')[0].split('.').pop()
    const cacheResource = async () => {
      return Message.background.send(Action.Background.CacheResource, {
        url,
        domain,
        requestOptions,
        resourceType,
      })
    }

    if (resourceType === 'css') {
      const resourceResult = await Message.background.send(
        Action.Background.HandleIDB,
        {
          storeName: 'resource',
          handleType: 'getId',
          params: url,
        }
      )

      /** 如果数据中已经有当前资源数据，就不等待请求返回 */
      resourceResult ? await cacheResource() : cacheResource()

      /** 这个 fetch 方法传入 singleFile 中后会被缓存，所以只能将变量挂在全局来使用 */
      window.webDocumentStyleLinks.push(url)

      return { status: 200 }
    }

    return fetch(url, requestOptions)
  }
}

/** 获取当前页面信息 */
const getPageData = async () => {
  const { href, host } = location
  const domain = host.startsWith('www.') ? host.slice(4) : host
  /** 清除之前缓存页面时的样式外链文件 */
  window.webDocumentStyleLinks = []
  /** 获取页面数据 */
  const singleFileData = await singlefile.getPageData(
    {
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
    },
    {
      fetch: getRequest(domain),
    }
  )
  const { content, title } = singleFileData
  const htmlDocument = document.implementation.createHTMLDocument('')
  htmlDocument.write(content)

  const body = dom.query('body', htmlDocument.cloneNode(true) as Document)
  dom.queryAll('script,style', body).forEach(item => item.remove())
  const textContent = body.textContent?.replace(/\s+/g, ' ')

  return {
    htmlDocument,
    pageData: {
      title,
      href,
      domain,
      styleLinks: window.webDocumentStyleLinks,
      textContent,
      htmlContent: content,
      contentSize: getStorageSize(content + textContent),
    },
  }
}

/** 监听获取当前页面数据 */
Message.content.on(
  Action.Content.GetDocumentData,
  async (message, sendResponse) => {
    const { handleType } = message
    const { htmlDocument, pageData } = await getPageData()

    if (handleType === 'savePage') {
      sendResponse(pageData)
    } else if (handleType === 'saveArticle') {
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

      sendResponse({
        ...pageData,
        htmlContent,
        textContent,
        contentSize: getStorageSize(htmlContent + textContent),
      })
    }
  }
)
