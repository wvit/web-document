import { memo, useState, useEffect, useRef } from 'react'
import theme from 'antd/es/theme'
import flexSearch from 'flexsearch'
import { storeHandles } from '@/utils/idb'
import { Header } from '../Header'

/** 文档主页布局 */
export const Layout = memo(() => {
  const [pageList, setPageList] = useState<any[]>([])
  const [activePageData, setActivePageData] = useState<any>(null)
  const documentRef = useRef({} as flexSearch.Document<any, string[]>)
  const { token } = theme.useToken()

  /** 获取当前已保存的页面列表 */
  const getPageList = async () => {
    const { list } = await storeHandles.pages.getAll()

    documentRef.current = new flexSearch.Document({
      // encode: str => str.replace(/[\x00-\x7F]/g, '').split(''),
      document: {
        id: 'id',
        index: ['title', 'textContent', 'href'],
        store: ['title', 'textContent', 'href'],
      },
    })
    list.forEach(item => {
      documentRef.current.add(item)
    })

    setPageList(list)
  }

  /** 搜索文档内容 */
  const searchDocument = keywords => {
    const result = documentRef.current.search({
      query: keywords,
    })
    // const result = documentRef.current.search(keywords, {
    //   enrich: true,
    // })
    // const result = documentRef.current.search([
    //   {
    //     field: 'title',
    //     query: keywords,
    //   },
    //   {
    //     field: 'textContent',
    //     query: keywords,
    //   },
    //   {
    //     field: 'href',
    //     query: keywords,
    //   },
    // ] as any)

    console.log(11111, result)
  }

  useEffect(() => {
    getPageList()
  }, [])

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f0f0f0] flex flex-col">
      <Header
        onLogoClick={() => setActivePageData(null)}
        onSearch={searchDocument}
      />

      <div className="flex flex-1 h-[0]">
        <ul
          className="p-1 flex flex-wrap h-[100%] overflow-x-hidden overflow-y-auto"
          style={{
            width: activePageData ? '300px' : '100%',
            flexDirection: activePageData ? 'column' : 'row',
          }}
        >
          {pageList.map(item => {
            const { href, title } = item

            return (
              <li
                key={href}
                className="card-item m-2 self-start cursor-pointer w-[32%] max-w-[100%] h-[100px]"
                style={{
                  width: activePageData ? '95%' : '300px',
                  border:
                    activePageData?.href === href
                      ? `1px solid ${token.colorPrimary}`
                      : 'none',
                }}
              >
                <h3
                  title={title}
                  className="line-clamp-2"
                  onClick={() => {
                    setActivePageData(
                      activePageData?.href === href ? null : item
                    )
                  }}
                >
                  {title}
                </h3>
                <a
                  title={href}
                  href={href}
                  target="_blank"
                  className="line-clamp-2 mt-1 break-words"
                  style={{ color: token.colorLink }}
                >
                  {href}
                </a>
              </li>
            )
          })}
        </ul>
        {activePageData && (
          <div className=" w-[100%] mt-3 mr-3">
            <iframe
              className="page-content w-[100%] h-[100%]"
              srcDoc={activePageData.htmlContent}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  )
})
