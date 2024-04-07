import { memo, useState, useEffect } from 'react'
import Button from 'antd/es/button'
import message from 'antd/es/message'
import theme from 'antd/es/theme'
import { Message, Action } from '@/utils'
import { storeHandles } from '@/utils/idb'

/** 页面存储器 */
export const PageStorage = memo(() => {
  const [pageList, setPageList] = useState<any[]>([])
  const [saveLoading, setSaveLoading] = useState(false)
  const { token } = theme.useToken()

  /** 获取当前已保存的页面列表 */
  const getPageList = async () => {
    const { list } = await storeHandles.pages.getAll()
    setPageList(list)
  }

  /** 保存当前页面 */
  const saveCurrentPage = async (action: Action.Content) => {
    setSaveLoading(true)
    const msgRes = await Message.content.activeSend({ action })
    setSaveLoading(false)

    await storeHandles.pages.create({ id: msgRes.href, ...msgRes })
    message.success('保存成功')
    getPageList()
  }

  /** 渲染保存页面按钮 */
  const renderSaveBtn = (action: Action.Content, btnName) => {
    return (
      <Button
        loading={saveLoading}
        type="primary"
        className="mr-2"
        onClick={() => saveCurrentPage(action)}
      >
        {btnName}
      </Button>
    )
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
        {renderSaveBtn(Action.Content.GetPage, '保存当前页面')}
        {renderSaveBtn(Action.Content.GetArticle, '仅保存当前页面文章')}
      </div>
      <div className="w-[100%] h-[100%]">
        <ul className=" w-[300px] p-3">
          {pageList.map(item => {
            const { href, title } = item
            return (
              <li className="card-item mt-2 cursor-pointer">
                <h3 title={title} className="line-clamp-2">
                  {title}
                </h3>
                <a
                  title={href}
                  className="line-clamp-2 mt-1"
                  style={{ color: token.colorLink }}
                >
                  {href}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
