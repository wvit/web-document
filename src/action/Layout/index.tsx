import { memo, useState } from 'react'
import Button from 'antd/es/button'
import { Message, Action, getResource, getI18n } from '@/utils'
import { DocumentManage } from '../DocumentManage'

/** 页面布局 */
export const Layout = memo(() => {
  const [saveLoading, setSaveLoading] = useState(false)

  /** 保存当前页面 */
  const saveCurrentPage = async handleType => {
    setSaveLoading(true)
    await Message.background.send(Action.Background.SaveDocument, {
      handleType,
    })
    setSaveLoading(false)
  }

  return (
    <div className="flex flex-col h-[100%]">
      <div
        className="p-3 bg-[#fff]"
        style={{
          boxShadow: '1px 1px 6px 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Button
          loading={saveLoading}
          type="primary"
          className="mr-2"
          onClick={() => saveCurrentPage('savePage')}
        >
          {getI18n('保存当前页面')}
        </Button>
        <Button
          loading={saveLoading}
          type="primary"
          className="mr-2"
          onClick={() => saveCurrentPage('saveArticle')}
        >
          {getI18n('仅保存文章内容')}
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
          {getI18n('打开文档主页')}
        </Button>
      </div>

      <DocumentManage />
    </div>
  )
})
