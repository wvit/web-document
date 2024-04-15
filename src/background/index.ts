import { Message, Action } from '@/utils'
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
