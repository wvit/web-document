import { memo } from 'react'
import Button from 'antd/es/button'
import { Message, Action } from '@/utils'

/** 页面存储器 */
export const PageStorage = memo(() => {
  /** 保存当前页面 */
  const saveCurrentPage = async () => {
    const msgRes = await Message.content.activeSend({
      action: Action.Content.GetPage,
    })
    const iframe: any = document.querySelector('.html-container')

    iframe.srcdoc = msgRes
  }

  return (
    <div className="flex flex-col h-[100%]">
      <div>
        <Button type="primary" onClick={saveCurrentPage}>
          保存当前页面
        </Button>
      </div>
      <iframe className="html-container w-[100%] h-[100%]"></iframe>
    </div>
  )
})
