import { memo, useState, useEffect } from 'react'
import Button from 'antd/es/button'
import message from 'antd/es/message'
import { Message, Action, getResource } from '@/utils'
import { storeHandles } from '@/utils/idb'

const textEncoder = new TextEncoder()

/** 页面存储器 */
export const PageStorage = memo(() => {
  const [saveLoading, setSaveLoading] = useState(false)
  const [pageList, setPageList] = useState<any[]>([])

  /** 保存当前页面 */
  const saveCurrentPage = async (action: Action.Content) => {
    setSaveLoading(true)
    const msgRes = await Message.content.activeSend({ action })
    setSaveLoading(false)

    await storeHandles.pages.create({ id: msgRes.href, ...msgRes })
    message.success('保存成功')
    getPageList()
  }

  /** 获取文档页面列表 */
  const getPageList = async () => {
    const { list } = await storeHandles.pages.getAll()

    list.forEach(item => {
      const dataEncode = textEncoder.encode(JSON.stringify(item))
      item.storageSize = (dataEncode.length / 1024 / 1024).toFixed(2)
    })

    setPageList(list)
  }

  useEffect(() => {
    getPageList()
  }, [])

  return (
    <div className="flex flex-col h-[100%]">
      <div
        className="p-3"
        style={{
          boxShadow: '1px 1px 6px 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Button
          loading={saveLoading}
          type="primary"
          className="mr-2"
          onClick={() => {
            saveCurrentPage(Action.Content.GetPage)
          }}
        >
          保存当前页面
        </Button>
        <Button
          loading={saveLoading}
          type="primary"
          className="mr-2"
          onClick={() => {
            saveCurrentPage(Action.Content.GetArticle)
          }}
        >
          仅保存当前页面文章
        </Button>
        <Button
          type="primary"
          className="mr-2"
          onClick={() => {
            chrome.tabs.create({
              url: getResource('/page/index.html'),
            })
          }}
        >
          打开文档主页
        </Button>
      </div>

      <div className="p-2">
        <h4 className=' text-base'>已保存文档占用空间大小</h4>
        <ul className='mt-2'>
          {pageList.map(item => {
            const { title, href, storageSize } = item
            return (
              <li className='flex items-center mt-2'>
                <a href={href} target="_blank" className='max-w-[300px] line-clamp-1'>
                  {title}:
                </a>
                <span className="ml-2">{storageSize} MB</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
