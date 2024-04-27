import { memo, useState } from 'react'
import Button from 'antd/es/button'
import { Message, Action, getResource, getI18n } from '@/utils'
import { DocumentManage } from '../DocumentManage'
import { PreferenceSetting } from '../PreferenceSetting'

/** 页面布局 */
export const Layout = memo(() => {
  const [saveLoading, setSaveLoading] = useState(false)
  const [preferenceSetting, setPreferenceSetting] = useState({})

  /** 保存当前页面 */
  const saveCurrentPage = async (
    handleType: 'getPageData' | 'getArticleData'
  ) => {
    setSaveLoading(true)
    await Message.background.send(Action.Background.SaveDocument, {
      handleType,
    })
    setSaveLoading(false)
  }

  return (
    <div className="flex flex-col h-[100%]">
      <div
        className="p-3 bg-[#fff] flex justify-between"
        style={{
          boxShadow: '1px 1px 6px 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div>
          <Button
            loading={saveLoading}
            type="primary"
            className="mr-2"
            onClick={() => saveCurrentPage('getPageData')}
          >
            {getI18n('保存当前页面')}
          </Button>
          <Button
            loading={saveLoading}
            type="primary"
            className="mr-2"
            onClick={() => saveCurrentPage('getArticleData')}
          >
            {getI18n('仅保存文章内容')}
          </Button>
        </div>
        <div>
          <Button
            type="link"
            href={getResource('/page/index.html')}
            target="_blank"
          >
            {getI18n('打开文档主页')}
          </Button>
          <PreferenceSetting onChange={setPreferenceSetting} />
        </div>
      </div>

      <div className="flex-1 h-[0]">
        <DocumentManage preferenceSetting={preferenceSetting} />
      </div>
    </div>
  )
})
