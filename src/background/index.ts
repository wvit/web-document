import { Message, Action, getI18n } from '@/utils'
import { storeHandles } from '@/utils/idb'

/** 监听保存页面通知 */
Message.background.on(
  Action.Background.SaveDocument,
  async (message, sendResponse) => {
    const { handleType } = message
    const msgRes = await Message.content.activeSend(
      Action.Content.GetDocumentData,
      { handleType }
    )
    const status = await storeHandles.document.create({
      id: msgRes.href,
      ...msgRes,
    })

    sendResponse(status)
    Message.action.send(Action.Action.RefreshDocumentData)
  }
)

/** 给 content 环境提供操作数据库方法 */
Message.background.on(
  Action.Background.HandleIDB,
  async (message, sendResponse) => {
    const { storeName, handleType, params } = message
    const result = await storeHandles[storeName][handleType](params)

    sendResponse(result)
  }
)

chrome.contextMenus.create({
  id: 'savePage',
  title: getI18n('保存当前页面'),
  contexts: ['page'],
})

chrome.contextMenus.create({
  id: 'saveArticle',
  title: getI18n('仅保存文章内容'),
  contexts: ['page'],
})

chrome.contextMenus.create({
  id: 'openDocumentPage',
  title: getI18n('打开文档主页'),
  contexts: ['page'],
})

/** 监听右键菜单 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info, tab)
})
