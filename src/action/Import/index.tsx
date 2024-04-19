import { memo, useEffect, useState } from 'react'
import Dropdown from 'antd/es/dropdown'
import Button from 'antd/es/button'
import Input from 'antd/es/input'
import message from 'antd/es/message'
import Modal from 'antd/es/modal'
import Space from 'antd/es/space'
import { storeHandles, objectHandles } from '@/utils/idb'
import { getI18n, uploadFile, getFileData } from '@/utils'
import { DocumentList } from '../DocumentList'

type ImportData = {
  /** 插件的版本 */
  version: string
  /** 导入的文档列表 */
  documents: any[]
  /** 导入文档关联的资源列表 */
  resources: any[]
}

export interface ImportProps {
  /** 导入成功 */
  onSuccess?: () => {}
}

/** 导入文档组件 */
export const Import = memo((props: ImportProps) => {
  const { onSuccess } = props
  const [selectIds, setSelectIds] = useState<string[]>([])
  const [importType, setImportType] = useState<'file' | 'url' | null>()
  const [importData, setImportData] = useState<Partial<ImportData>>({})
  const [importUrl, setImportUrl] = useState('')
  const [importUrlLoading, setImportUrlLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)

  /** 获取全局配置 */
  const getImportUrl = async () => {
    const { importDocumentUrl } = await objectHandles.globalConfig.get()
    setImportUrl(importDocumentUrl)
  }

  /** 导入json文件内容 */
  const importJsonFile = async (file: Blob) => {
    try {
      const jsonData = JSON.parse(await getFileData(file!, 'text'))

      /** 验证json对象内容 */
      if (jsonData.version && jsonData.documents && jsonData.resources) {
        message.success('请选择需要导入的文档')
        setImportData(jsonData)
      } else {
        message.warning('导入失败，请确认文档内容后重试')
      }
    } catch {
      message.warning('导入失败，请确认文档内容后重试')
    }
  }

  /** 上传JSON配置文件 */
  const uploadJsonFile = async () => {
    const { status, file } = await uploadFile({ accept: '.json' })
    if (status !== 'success') return

    await importJsonFile(file!)
    setImportType('file')
  }

  /** 关闭导入文档弹窗 */
  const closeImport = () => {
    setImportType(null)
    setImportLoading(false)
    setImportUrlLoading(false)
    setSelectIds([])
    setImportData({})
  }

  /** 解析并导入已选中的文档 */
  const importSelectDocuments = async () => {
    if (!selectIds.length) {
      return message.warning('请选择需要导入的文档')
    }

    try {
      const { documents = [], resources = [] } = importData

      setImportLoading(true)
      for (const documentItem of documents) {
        const { id, styleLinks } = documentItem || {}
        if (!selectIds.includes(id)) return

        /** 向数据库添加文档数据 */
        await storeHandles.document.create(documentItem)

        /** 向数据库添加文档关联的资源 */
        for (const styleId of styleLinks) {
          const findResource = resources?.find(
            resourceItem => resourceItem.id === styleId
          )
          if (findResource) {
            await storeHandles.resource.create(findResource)
          }
        }
      }

      closeImport()
      onSuccess?.()
      message.success('导入完成')
    } catch {
      setImportLoading(false)
      message.warning('导入失败，请确认文档内容后重试')
    }
  }

  /** 下载导入url内容 */
  const downloadImportUrl = async () => {
    objectHandles.globalConfig.set({ importDocumentUrl: importUrl })

    try {
      setImportUrlLoading(true)
      const res = await fetch(importUrl).then(res => res.blob())
      setImportUrlLoading(false)
      importJsonFile(res)
    } catch {
      setImportUrlLoading(false)
      message.warning('导入URL内容失败')
    }
  }

  useEffect(() => {
    getImportUrl()
  }, [])

  return (
    <>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'file',
              label: '上传JSON文件',
              onClick: uploadJsonFile,
            },
            {
              key: 'url',
              label: '从URL导入',
              onClick: () => setImportType('url'),
            },
          ],
        }}
      >
        <Button size="small" className="ml-3">
          {getI18n('批量导入')}
        </Button>
      </Dropdown>

      <Modal
        open={!!importType}
        width="80vw"
        title="批量导入"
        style={{ top: 50 }}
        styles={{ header: { margin: 0 } }}
        confirmLoading={importLoading}
        onCancel={closeImport}
        onOk={importSelectDocuments}
        okText="确认导入"
        cancelText="取消导入"
      >
        <div className="flex flex-col h-[65vh]">
          {importType === 'url' && (
            <Space.Compact className="pt-2">
              <Input
                value={importUrl}
                placeholder="请输入您需要导入的url地址"
                onChange={e => setImportUrl(e.target?.value)}
              />
              <Button
                type="primary"
                onClick={downloadImportUrl}
                loading={importUrlLoading}
              >
                {importUrlLoading ? '正在下载，请稍后' : '确认下载'}
              </Button>
            </Space.Compact>
          )}
          <div className="h-0 flex-1">
            <DocumentList
              documents={importData?.documents || []}
              documentItemProps={{
                style: { border: '1px solid rgba(0,0,0,0.1)', width: '48%' },
              }}
              selectIds={selectIds}
              onSelectChange={setSelectIds}
            />
          </div>
        </div>
      </Modal>
    </>
  )
})
