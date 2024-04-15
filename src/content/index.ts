import { Readability } from '@mozilla/readability'
import { Dom, styleToString, Message, Action } from '@/utils'

const textEncoder = new TextEncoder()

/** 获取内容占用磁盘空间大小 */
const getStorageSize = content => {
  const dataEncode = textEncoder.encode(content)
  const storageSize = `${(dataEncode.length / 1024 / 1024).toFixed(2)} MB`
  return storageSize
}

/** 重写 singleFile 的 fetch 资源方法 */
const useRequest = options => {
  const { styleLinks, domain } = options
  return async (url, requestOptions) => {
    const type = url.split('.').pop()
    const fetchData = async () => {
      const res = await fetch(url, requestOptions)
      const content = await res.text()

      Message.background.send(Action.Background.HandleIDB, {
        storeName: 'resource',
        handleType: 'create',
        params: { id: url, type, content, domain },
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

      /** 当前页面所需的css依赖 */
      styleLinks.push(url)

      return { status: 200 }
    }

    return fetch(url, requestOptions)
  }
}

/** 获取当前页面信息 */
const getPageData = async () => {
  const { href, host: domain } = location
  /** 存放当前页面需要哪些外链 style */
  const styleLinks: string[] = []
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
    { fetch: useRequest({ styleLinks, domain }) }
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
      styleLinks,
      textContent,
      htmlContent: content,
      contentSize: getStorageSize(content + textContent),
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

    sendResponse({
      ...pageData,
      htmlContent,
      textContent,
      contentSize: getStorageSize(htmlContent + textContent),
    })
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
