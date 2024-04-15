import { memo } from 'react'
import theme from 'antd/es/theme'
import Popover from 'antd/es/popover'
import Empty from 'antd/es/empty'

export interface DocumentListProps {
  /** 文档列表 */
  documents: any[]
  /** 当前选中的数据 */
  activeData: any
  /** 是否为搜索状态 */
  searchStatus: boolean
  /** 选中文档事件 */
  onSelect: (data: any) => void
}

/** 文档列表 */
export const DocumentList = memo((props: DocumentListProps) => {
  const { documents, searchStatus, activeData, onSelect } = props
  const { token } = theme.useToken()

  /** 渲染文档项头部内容 */
  const renderHeader = searchResult => {
    const keywords = Object.keys(searchResult || {})
    if (!searchResult) return null

    return (
      <div
        className="mb-2 pb-1 flex flex-wrap items-center leading-5"
        style={{ borderBottom: '1px dashed rgba(0,0,0,0.2)' }}
      >
        <span className="mr-2">包含</span>
        {keywords.map((keyword, index) => {
          return (
            <>
              {index ? '、' : ''}
              <Popover
                content={
                  <>
                    <span className=" font-medium mr-2">
                      {searchResult[keyword].join('、')}
                    </span>
                    中包含此关键词
                  </>
                }
              >
                <span
                  key={keyword}
                  className=" font-semibold mx-1"
                  style={{ color: token.colorLink }}
                >
                  "{keyword}"
                </span>
              </Popover>
            </>
          )
        })}
      </div>
    )
  }

  return documents.length ? (
    <ul
      className="p-1 flex flex-wrap flex-row max-h-[100%] h-fit overflow-x-hidden overflow-y-auto"
      style={{
        width: activeData ? '300px' : '100%',
      }}
    >
      {documents?.map(item => {
        const { href, title, searchResult } = item

        return (
          <li
            key={href}
            className="card-item m-2 cursor-pointer max-w-[100%]"
            style={{
              width: activeData ? '95%' : '300px',
              border:
                activeData?.href === href
                  ? `1px solid ${token.colorPrimary}`
                  : 'none',
            }}
            onClick={() => {
              onSelect(activeData?.href === href ? null : item)
            }}
          >
            {renderHeader(searchResult)}
            <h3 title={title} className="line-clamp-2 mb-2">
              {title}
            </h3>
            <a
              title={href}
              href={href}
              target="_blank"
              className="line-clamp-2 my-1"
              style={{ color: token.colorLink, overflowWrap: 'anywhere' }}
            >
              {href}
            </a>
          </li>
        )
      })}
    </ul>
  ) : (
    <Empty
      className=" mx-auto mt-16 px-2"
      description={
        searchStatus ? '暂无搜索数据，请换一个关键词试试吧' : '暂无数据'
      }
    />
  )
})
