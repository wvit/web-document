import { memo } from 'react'
import Button from 'antd/es/button'
import { Message, Action } from '@/utils'

/** 页面存储器 */
export const PageStorage = memo(() => {
  /** 保存当前页面 */
  const saveCurrentPage = async (action: Action.Content) => {
    const msgRes = await Message.content.activeSend({ action })
    const iframe: any = document.querySelector('.html-container')

    iframe.srcdoc = msgRes.htmlContent
  }

  return (
    <div className="flex flex-col h-[100%]">
      <div
        className="p-3"
        style={{
          boxShadow: '1px 1px 6px 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Button
          type="primary"
          className="mr-2"
          onClick={() => saveCurrentPage(Action.Content.GetPage)}
        >
          保存当前页面
        </Button>
        <Button
          type="primary"
          onClick={() => saveCurrentPage(Action.Content.GetArticle)}
        >
          仅保存当前页面文章
        </Button>
      </div>
      <iframe className="html-container w-[100%] h-[100%]"></iframe>
    </div>
  )
})
