import { memo, useState, useEffect } from 'react'
import Checkbox from 'antd/es/checkbox'
import Button from 'antd/es/button'
import Popconfirm from 'antd/es/popconfirm'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import Radio from 'antd/es/radio'
import { Message, Action, getI18n, uploadFile } from '@/utils'
import { storeHandles, objectHandles, getDomainList } from '@/utils/idb'

/** 文档管理组件 */
export const DocumentManage = memo(() => {
  const [documentList, setDocumentList] = useState<any[]>([])
  const [domainList, setDomainList] = useState<any[]>([])
  const [selectIds, setSelectIds] = useState<string[]>([])
  const [displayType, setDisplayType] = useState<'default' | 'domain'>(
    'default'
  )

  /** 是否全选状态 */
  const checkAll =
    documentList.length > 0 && documentList.length === selectIds.length

  /** 是否为半全选状态 */
  const indeterminate =
    selectIds.length > 0 && selectIds.length < documentList.length

  /** 获取列表展示类型 */
  const getDisplayType = async () => {
    const { listDisplayType } = await objectHandles.globalConfig.get()
    setDisplayType(listDisplayType || 'default')
  }

  /** 获取文档页面列表 */
  const getDocumentData = async () => {
    const { list } = await storeHandles.document.getAll()
    const domainList = await getDomainList(list)

    setDocumentList(list)
    setDomainList(domainList)
    return list
  }

  /** 设置列表展示类型 */
  const setListDisplayType = listDisplayType => {
    setDisplayType(listDisplayType)
    objectHandles.globalConfig.set({ listDisplayType })
  }

  /** 删除文档相关联的资源数据 */
  const deleteResource = async deleteDocuments => {
    const list = await getDocumentData()
    /** 已删除的资源 ids */
    const deleteResourceIds: string[] = Array.from(
      new Set(deleteDocuments.map(item => item.styleLinks).flat())
    )
    /** 目前正在使用中的资源 ids */
    const currentResourceIds: string[] = Array.from(
      new Set(list.map(item => item.styleLinks).flat())
    )

    deleteResourceIds.forEach(item => {
      if (!currentResourceIds.includes(item)) {
        /** 如果在使用中的资源 ids 中没有找到此 id，就从数据库中删除 */
        storeHandles.resource.delete(item)
      }
    })
  }

  /** 删除已选页面文档 */
  const deleteDocuments = async () => {
    const deleteDocuments = documentList.filter(item =>
      selectIds.includes(item.id)
    )

    await storeHandles.document.batchDelete(selectIds)

    setSelectIds([])
    deleteResource(deleteDocuments)
    message.success(getI18n('删除成功'))
  }

  /** 导出所选页面文档 */
  const exportDocuments = async () => {}

  /** 全选所有文档 */
  const selectAllDoc = e => {
    setSelectIds(e.target.checked ? documentList.map(item => item.id) : [])
  }

  /** 导入配置文件 */
  const importUploadChange = async () => {
    const result = await uploadFile({ accept: '.json' })

    console.log(111111, result)
  }

  /** 渲染文档列表 */
  const renderDocumentList = list => {
    return (
      <ul className="mt-2 flex flex-wrap">
        {list.map(item => {
          const { id, title, href, contentSize, domain } = item
          const path = href.split(domain)[1]

          return (
            <li key={id} className="card-item flex m-1 w-[252px]">
              <Checkbox value={id} className="mr-2" />
              <div className=" text-xs w-[100%]">
                <div className="flex justify-between">
                  <span className=" max-w-[72%] break-all line-clamp-1">
                    {displayType === 'default' ? domain : path}
                  </span>
                  <span className="ml-2">{contentSize} MB</span>
                </div>
                <a
                  href={href}
                  target="_blank"
                  className=" mt-2 line-clamp-2 w-fit"
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

  useEffect(() => {
    getDocumentData()
    getDisplayType()

    Message.action.on(Action.Action.RefreshDocumentData, getDocumentData)
  }, [])

  return (
    <div className="p-2 flex flex-col flex-1 h-0">
      <div className="ml-1 mt-1 flex items-center justify-between">
        <div>
          <Checkbox
            indeterminate={indeterminate}
            onChange={selectAllDoc}
            checked={checkAll}
          >
            {getI18n('全选')}
          </Checkbox>

          {!!selectIds.length && (
            <>
              <Popconfirm
                title={getI18n('是否确认删除所选页面文档?')}
                onConfirm={deleteDocuments}
                overlayClassName=" max-w-[300px]"
                cancelText={getI18n('取消')}
                okText={getI18n('确认')}
              >
                <Button size="small" className="ml-2">
                  {getI18n('删除所选项')}
                </Button>
              </Popconfirm>

              <Popconfirm
                title={getI18n('是否确认导出所选页面文档?')}
                onConfirm={exportDocuments}
                overlayClassName=" max-w-[300px]"
                cancelText={getI18n('取消')}
                okText={getI18n('确认')}
              >
                <Button size="small" className="ml-2">
                  {getI18n('导出所选项')}
                </Button>
              </Popconfirm>
            </>
          )}
        </div>

        <div className="pr-2 flex">
          <Radio.Group
            value={displayType}
            size="small"
            buttonStyle="solid"
            optionType="button"
            options={[
              { label: getI18n('默认排列'), value: 'default' },
              { label: getI18n('按网站排列'), value: 'domain' },
            ]}
            onChange={e => setListDisplayType(e.target.value)}
          />

          <div className="relative">
            <Button
              type="primary"
              size="small"
              className="ml-3"
              onClick={importUploadChange}
            >
              {getI18n('批量导入')}
            </Button>
          </div>
        </div>
      </div>

      {documentList.length ? (
        <Checkbox.Group
          className="overflow-auto"
          value={selectIds}
          onChange={setSelectIds}
        >
          {displayType === 'default'
            ? renderDocumentList(documentList)
            : domainList.map(item => {
                const { domain, styleSize, children } = item

                return (
                  <div className="w-[100%]">
                    <h3 className="pl-1 mt-2 text-base">
                      {domain}
                      <span className=" font-normal text-xs ml-2 text-gray-400">
                        ({styleSize} MB)
                      </span>
                    </h3>
                    {renderDocumentList(children)}
                  </div>
                )
              })}
        </Checkbox.Group>
      ) : (
        <Empty className=" mt-6" description={getI18n('暂无数据')} />
      )}
    </div>
  )
})
