import { Message, Action } from '@/utils'
import { storeHandles } from '@/utils/idb'

Message.background.on(
  Action.Background.HandleIDB,
  async (message, sender, sendResponse) => {
    const { storeName, handleType, params } = message
    const result = await storeHandles[storeName][handleType](params)

    sendResponse(result)
  }
)
