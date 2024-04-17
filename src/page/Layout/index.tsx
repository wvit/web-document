import { memo, useState, useEffect } from 'react'
import { qs } from '@/utils'
import { storeHandles } from '@/utils/idb'
import { Header } from '../Header'
import { DocumentList } from '../DocumentList'
import { Sandbox } from '../Sandbox'

const urlQuery = qs.getQuery()

/** 文档主页布局 */
export const Layout = memo(() => {
  const [documents, setDocuments] = useState<any[]>([])
  const [searchStatus, setSearchStatus] = useState(false)
  const [activeDocument, setActiveDocument] = useState<any>(null)

  /** 初始化时获取当前选中的文档页面 */
  const initActiveDocument = async () => {
    const { documentId } = urlQuery
    if (!documentId) return
    const findDocument = await storeHandles.document.getId(documentId)
    setActiveDocumentData(findDocument)
  }

  /** 设置当前选中的文档页面 */
  const setActiveDocumentData = (activeData?) => {
    const urlObject = new URL(location.href)

    urlObject.search = qs.stringify(
      { ...urlQuery, documentId: activeData?.id || '' },
      ''
    )

    /** 使用 history.replaceState() 更新 URL，避免刷新页面 */
    history.replaceState({}, '', urlObject.href)
    setActiveDocument(activeData)
  }

  useEffect(() => {
    initActiveDocument()
  }, [])

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f0f0f0] flex flex-col">
      <Header
        onLogoClick={setActiveDocumentData}
        onChange={(list, status) => {
          setDocuments(list)
          setSearchStatus(status)
        }}
      />

      <div className="flex flex-1 h-[0]">
        <DocumentList
          searchStatus={searchStatus}
          documents={documents}
          activeData={activeDocument}
          onSelect={setActiveDocumentData}
        />
        <Sandbox activeData={activeDocument} />
      </div>
    </div>
  )
})
