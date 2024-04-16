import { Readability } from '@mozilla/readability'
import { Dom, styleToString, Message, Action, getI18n } from '@/utils'

const textEncoder = new TextEncoder()

/** 获取内容占用磁盘空间大小 */
const getStorageSize = content => {
  const dataEncode = textEncoder.encode(content)
  const storageSize = Number((dataEncode.length / 1024 / 1024).toFixed(2))
  return storageSize
}

/** 重写 singleFile 的 fetch 资源方法 */
const getRequest = domain => {
  return async (url, requestOptions) => {
    const type = url.split('.').pop()
    const fetchData = async () => {
      const res = await fetch(url, requestOptions)
      const content = await res.text()
      const contentSize = getStorageSize(content)

      Message.background.send(Action.Background.HandleIDB, {
        storeName: 'resource',
        handleType: 'create',
        params: { id: url, type, content, domain, contentSize },
      })
    }

    if (type === 'css') {
      const resourceResult = await Message.background.send(
        Action.Background.HandleIDB,
        {
          storeName: 'resource',
          handleType: 'getId',
          params: url,
        }
      )

      /** 如果数据中已经有当前资源数据，就不等待请求返回 */
      resourceResult ? await fetchData() : fetchData()

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

  const body = Dom.query('body', htmlDocument.cloneNode(true) as Document)
  Dom.queryAll('script,style', body).forEach(item => item.remove())
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
