import { Message, Action, getI18n } from '@/utils'
import { storeHandles } from '@/utils/idb'

/** 通知 content 环境保存页面文档 */
export const saveDocument = async options => {
  const { handleType } = options
  const msgRes = await Message.content.activeSend(
    Action.Content.GetDocumentData,
    { handleType }
  )
  const status = await storeHandles.document.create({
    id: msgRes.href,
    ...msgRes,
  })

  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/icon.png',
    title: getI18n('网页文档'),
    contextMessage: true
      ? getI18n('保存完成')
      : getI18n('保存失败，请刷新重试'),
    message: '',
  })

  return status
}

/** 监听保存页面通知 */
Message.background.on(
  Action.Background.SaveDocument,
  async (message, sendResponse) => {
    const status = await saveDocument(message)

    Message.action.send(Action.Action.RefreshDocumentData).catch(() => {})
    sendResponse(status)
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
