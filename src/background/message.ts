import { Message, Action, getI18n, getStorageSize } from '@/utils'
import { storeHandles } from '@/utils/idb'

/** 通知 content 环境保存页面文档 */
export const saveDocument = async options => {
  const { handleType } = options
  const msgRes = await Message.content.activeSend(
    Action.Content.GetDocumentData,
    { handleType }
  )
  const { href, domain } = msgRes
  const status = await storeHandles.document.create({
    id: href,
    ...msgRes,
  })
  const notificationId = `${Math.random().toString().slice(-10)}${href}`

  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: '/icon.png',
    title: getI18n('网页文档'),
    contextMessage: `${domain} : ${getI18n('保存完成，点击查看')}`,
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

/** 缓存远程资源 */
Message.background.on(
  Action.Background.CacheResource,
  async (message, sendResponse) => {
    const { url, domain, resourceType, requestOptions } = message
    const res = await fetch(url, requestOptions)
    const content = await res.text()
    const contentSize = getStorageSize(content)
    const status = await storeHandles.resource.create({
      id: url,
      resourceType,
      content,
      domain,
      contentSize,
    })

    sendResponse(status)
  }
)
