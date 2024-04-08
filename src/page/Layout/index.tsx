import { memo, useState, useEffect } from 'react'
import theme from 'antd/es/theme'
import { Header } from '../Header'
import { storeHandles } from '@/utils/idb'

/** 文档主页布局 */
export const Layout = memo(() => {
  const [pageList, setPageList] = useState<any[]>([])
  const [activePageData, setActivePageData] = useState<any>(null)
  const { token } = theme.useToken()

  /** 获取当前已保存的页面列表 */
  const getPageList = async () => {
    const { list } = await storeHandles.pages.getAll()    
    setPageList(list)
  }

  useEffect(() => {
    getPageList()
  }, [])

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f0f0f0] flex flex-col">
      <Header />

      <div className="flex flex-1 h-[0]">
        <ul
          className="p-2 flex flex-wrap h-[100%] overflow-x-hidden overflow-y-auto"
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
                  onClick={() =>
                    setActivePageData(
                      activePageData?.href === href ? null : item
                    )
                  }
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
