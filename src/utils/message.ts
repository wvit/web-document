/** 发送消息数据类型 */
type MessageType<T extends Action.Background | Action.Content | Action.Window> =
  {
    action: T
    [key: string]: any
  }

/** 区分 chrome.runtime.message 的 action 操作类型*/
export namespace Action {
  export enum Content {
    /** 获取当前选项卡的页面内容 */
    GetPage = 'getPage',
    /** 获取文章 */
    GetArticle = 'GetArticle',
  }

  export enum Background {
    /** 在后台中操作IDB */
    HandleIDB = 'handleIDB',
  }

  export enum Window {}
}

/** 方便区分消息的走向，因为在 chrome 扩展中，有 background newtab content action 等多个环境。 */
export const Message = {
  content: {
    /** 向指定 newtab 页面发送 message */
    send: (tabId: number, action: Action.Content, message?: any) => {
      return chrome.tabs.sendMessage(tabId, { action, ...message })
    },

    /** 向当前选中页面的 content 发送 message */
    activeSend: async (action: Action.Content, message?: any) => {
      const { id } =
        (
          await chrome.tabs.query({
            active: true,
            currentWindow: true,
          })
        )[0] || {}

      if (id) {
        return chrome.tabs.sendMessage(id, { action, ...message })
      }
    },

    /** 监听向 content 发送的 message 事件 */
    on: (
      action: Action.Content,
      callback: (
        message: any,
        sender: any,
        sendResponse: (data?: any) => void
      ) => void
    ) => {
      chrome.runtime.onMessage.addListener(
        (message: MessageType<Action.Content>, sender, sendResponse) => {
          if (action === message.action) {
            callback?.(message, sender, sendResponse)
            /** 返回 true，告诉chrome.runtime， 这个 sendResponse 会后续响应 */
            return true
          }
        }
      )
    },
  },

  background: {
    /** 向 background 发送消息 */
    send: (action: Action.Background, message?: any) => {
      return chrome.runtime.sendMessage({ action, ...message })
    },

    /** 监听向 background 发送的 message 事件 */
    on: (
      action: Action.Background,
      callback: (
        message: any,
        sender: any,
        sendResponse: (data?: any) => void
      ) => void
    ) => {
      chrome.runtime.onMessage.addListener(
        (message: MessageType<Action.Background>, sender, sendResponse) => {
          if (action === message.action) {
            callback?.(message, sender, sendResponse)
            return true
          }
        }
      )
    },
  },

  window: {
    /** 向 window 之间发送信息 */
    send: (target: Window, action: Action.Window, message?: any) => {
      target.postMessage({ action, ...message }, '*')
    },

    /** 监听 window 之间的通信 */
    on: (action: Action.Window, callback: (event: MessageEvent) => void) => {
      window.addEventListener('message', (e: MessageEvent) => {
        if (action === e.data.action) {
          callback?.(e)
        }
      })
    },
  },
}
