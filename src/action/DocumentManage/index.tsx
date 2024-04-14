import { memo, useState, useEffect } from 'react'
import Checkbox from 'antd/es/checkbox'
import Button from 'antd/es/button'
import Popconfirm from 'antd/es/popconfirm'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { storeHandles } from '@/utils/idb'

const textEncoder = new TextEncoder()

/** 文档管理组件 */
export const DocumentManage = memo(() => {
  const [documentList, setDocumentList] = useState<any[]>([])
  const [selectIds, setSelectIds] = useState<string[]>([])

  /** 是否全选状态 */
  const checkAll =
    documentList.length > 0 && documentList.length === selectIds.length

  /** 是否为半全选状态 */
  const indeterminate =
    selectIds.length > 0 && selectIds.length < documentList.length

  /** 获取文档页面列表 */
  const getDocumentList = async () => {
    const { list } = await storeHandles.document.getAll()

    list.forEach(item => {
      const dataEncode = textEncoder.encode(JSON.stringify(item))
      item.storageSize = (dataEncode.length / 1024 / 1024).toFixed(2)
    })
    setDocumentList(list)
  }

  /** 删除已选文档数据 */
  const deleteDocuments = async () => {
    await storeHandles.document.batchDelete(selectIds)
    setSelectIds([])
    message.success('删除成功')
  }

  /** 全选所有文档 */
  const selectAllDoc = e => {
    setSelectIds(e.target.checked ? documentList.map(item => item.id) : [])
  }

  useEffect(() => {
    getDocumentList()
    storeHandles.document.onChange(getDocumentList)
  }, [])

  return (
    <div className="p-2">
      <div className="ml-1 mt-1 flex items-center">
        <Checkbox
          indeterminate={indeterminate}
          onChange={selectAllDoc}
          checked={checkAll}
          className=" mr-6"
        >
          全选
        </Checkbox>

        {!!selectIds.length && (
          <Popconfirm
            title="是否确认删除所选页面文档？"
            onConfirm={deleteDocuments}
          >
            <Button size="small">删除所选项</Button>
          </Popconfirm>
        )}
      </div>

      {documentList.length ? (
        <Checkbox.Group value={selectIds} onChange={setSelectIds}>
          <ul className="mt-2 flex flex-wrap">
            {documentList.map(item => {
              const { id, title, href, storageSize, host } = item

              return (
                <li key={id} className="card-item flex m-1 w-[252px]">
                  <Checkbox value={id} className="mr-2" />
                  <div className=" text-xs">
                    <div className="flex justify-between">
                      <span className=" max-w-[75%] break-all line-clamp-1">
                        {host}
                      </span>
                      <span className="ml-2">{storageSize} MB</span>
                    </div>
                    <a
                      href={href}
                      target="_blank"
                      className=" mt-2 line-clamp-2"
                      title={title}
                    >
                      {title}
                    </a>
                  </div>
                </li>
              )
            })}
          </ul>
        </Checkbox.Group>
      ) : (
        <Empty className=" mt-6" />
      )}
    </div>
  )
})
