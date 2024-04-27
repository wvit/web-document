import { memo, useState, useEffect } from 'react'
import Button from 'antd/es/button'
import Popconfirm from 'antd/es/popconfirm'
import message from 'antd/es/message'
import Spin from 'antd/es/spin'
import { Message, Action, getI18n, downloadContent } from '@/utils'
import { storeHandles, getDomainList } from '@/utils/idb'
import manifestJson from '@/../public/manifest.json'
import { Import } from '../Import'
import { DocumentList } from '../DocumentList'

export interface DocumentManageProps {
  /** 偏好设置 */
  preferenceSetting: any
}

/** 文档管理组件 */
export const DocumentManage = memo((props: DocumentManageProps) => {
  const { preferenceSetting } = props
  const [documentList, setDocumentList] = useState<any[]>([])
  const [domainList, setDomainList] = useState<any[]>([])
  const [documentDataLoading, setDocumentDataLoading] = useState(false)
  const [selectIds, setSelectIds] = useState<string[]>([])

  /** 获取文档页面列表 */
  const getDocumentData = async () => {
    setDocumentDataLoading(true)
    const { list } = await storeHandles.document.getAll()
    const domainList = await getDomainList(list)
    setDocumentDataLoading(false)

    setDocumentList(list)
    setDomainList(domainList)
    return list
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
  const exportDocuments = async () => {
    const documents = documentList.filter(item => selectIds.includes(item.id))
    const resourceIds = Array.from(
      new Set(documents.map(item => item.styleLinks).flat())
    )
    const resources = await storeHandles.resource.getIds(resourceIds)

    message.success('正在为您导出为JSON文件')

    setTimeout(() => {
      const exportData = JSON.stringify(
        {
          version: manifestJson.version,
          documents,
          resources,
        },
        null,
        2
      )
      downloadContent(exportData, `${getI18n('网页文档')}.json`)
    }, 500)
  }

  /** 渲染文档列表头部内容 */
  const renderDocumentListHeader = () => {
    return (
      <div className="flex justify-between w-[100%]">
        <div>
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

        <div className="pr-1 flex">
          <Import onSuccess={getDocumentData} />
        </div>
      </div>
    )
  }

  useEffect(() => {
    getDocumentData()
    Message.action.on(Action.Action.RefreshDocumentData, getDocumentData)
  }, [])

  return (
    <div className="px-2 h-[100%]">
      <Spin spinning={documentDataLoading}>
        <DocumentList
          documents={documentList}
          domainDocuments={domainList}
          listDisplayType={preferenceSetting?.listDisplayType}
          selectIds={selectIds}
          renderHeader={renderDocumentListHeader}
          onSelectChange={setSelectIds}
        />
      </Spin>
    </div>
  )
})
