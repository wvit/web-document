import Checkbox from 'antd/es/checkbox'
import Empty from 'antd/es/empty'
import { getI18n } from '@/utils'
import type { ReactNode, HTMLAttributes } from 'react'

export interface DocumentListProps {
  /** 文档列表 */
  documents: any[]
  /** 按域名分类的文档列表 */
  domainDocuments?: any[]
  /** 所选列表项id */
  selectIds: string[]
  /** 排列方式 */
  displayType?: 'default' | 'domain'
  /** 给文档列表每项的参数 */
  documentItemProps?: HTMLAttributes<any>
  /** 渲染头部额外内容 */
  renderHeader?: () => ReactNode
  /** 选中列表项发生改变 */
  onSelectChange: (ids: string[]) => void
}

/** 文档列表 */
export const DocumentList = (props: DocumentListProps) => {
  const {
    documents,
    domainDocuments,
    selectIds,
    displayType,
    documentItemProps,
    renderHeader,
    onSelectChange,
  } = props

  /** 是否全选状态 */
  const checkAll = documents.length > 0 && documents.length === selectIds.length

  /** 是否为半全选状态 */
  const indeterminate =
    selectIds.length > 0 && selectIds.length < documents.length

  /** 全选所有列表项 */
  const selectAllDoc = e => {
    onSelectChange?.(e.target.checked ? documents.map(item => item.id) : [])
  }

  /** 渲染文档列表 */
  const renderDocumentList = list => {
    return (
      <ul className="flex flex-wrap">
        {list.map(item => {
          const { id, title, href, contentSize, domain } = item
          const path = href?.split(domain)[1]

          return (
            <li
              {...documentItemProps}
              key={id}
              className={`card-item flex m-1 w-[252px] ${
                documentItemProps?.className || ''
              } `}
            >
              <Checkbox value={id} className="mr-2" />
              <div className=" text-xs w-[100%]">
                <div className="flex justify-between">
                  <span className=" max-w-[72%] break-all line-clamp-1">
                    {displayType === 'domain' ? path : domain}
                  </span>
                  <span className="ml-2">{contentSize} MB</span>
                </div>
                <a
                  href={href}
                  target="_blank"
                  className=" mt-2 line-clamp-2 w-fit break-all"
                  title={title}
                >
                  {title}
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="flex flex-col h-[100%]">
      <div className="px-1 py-3 flex items-center">
        <div className=" shrink-0">
          <Checkbox
            indeterminate={indeterminate}
            onChange={selectAllDoc}
            checked={checkAll}
          >
            {getI18n('全选')}
          </Checkbox>
        </div>

        {renderHeader?.()}
      </div>

      {documents.length ? (
        <Checkbox.Group
          className="h-0 flex-1 overflow-auto"
          value={selectIds}
          onChange={onSelectChange}
        >
          {displayType === 'domain'
            ? domainDocuments?.map(item => {
                const { domain, styleSize, children } = item

                return (
                  <div className="w-[100%] mb-2">
                    <h3 className="pl-1 text-base">
                      {domain}
                      <span className=" font-normal text-xs ml-2 text-gray-400">
                        ({styleSize} MB)
                      </span>
                    </h3>
                    {renderDocumentList(children)}
                  </div>
                )
              })
            : renderDocumentList(documents)}
        </Checkbox.Group>
      ) : (
        <Empty className=" mt-6" description={getI18n('暂无数据')} />
      )}
    </div>
  )
}
