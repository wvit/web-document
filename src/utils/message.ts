/** 发送消息数据类型 */
type MessageType<T extends Action.Background | Action.Newtab | Action.Window> =
  {
    action: T
    [key: string]: any
  }

/** 区分 chrome.runtime.message 的 action 操作类型*/
export namespace Action {
  export enum Background {
    /** 安装小部件 */
    InstallWidget = 'installWidget',
    /** 卸载小部件 */
    UninstallWidget = 'uninstallWidget',
    /** 获取已安装小部件版本 */
    GetWidgetVersion = 'getWidgetVersion',
    /** 开始请求代理 */
    StartProxy = 'startProxy',
  }

  export enum Newtab {
    /** 获取小部件列表 */
    GetWidgetList = 'getWidgetList',
    /** 新创建一个小部件 */
    CreateWidget = 'createWidget',
    /** 更新小部件数据 */
    UpdateWidget = 'updateWidget',
    /** 移除小部件 */
    DeleteWidget = 'deleteWidget',
  }

  export enum Window {
    /** 部分场景需要转发 message。例如 网站向 backgorund 发送消息，或者 content 向 iframe 下的 iframe 发送消息。 */
    Forward = 'forward',
    /** 转发 http 请求 */
    HttpRequest = 'httpRequest',
    /** 转发 http 请求后的响应 */
    HttpResponse = 'httpResponse',
    /** 通知加载 sandbox 内容 */
    LoadSandbox = 'loadSandbox',
    /** 加载 iframe 的响应 */
    LoadIframeResponse = 'loadIframeResponse',
    /** 获取小部件版本的响应 */
    WidgetVersionResponse = 'widgetVersionResponse',
    /** 设置背景 */
    SetBackground = 'setBackground',
    /** 为沙盒环境提供的请求响应 */
    SandboxRequestResponse = 'sandboxRequestResponse',
  }
}

/** 方便区分消息的走向，因为在 chrome 扩展中，有 background newtab content action 等多个环境。 */
export const Message = {
  newtab: {
    /** 向指定 newtab 页面发送 message */
    send: (tabId: number, message: MessageType<Action.Newtab>) => {
      return new Promise<any>(resolve => {
        chrome.tabs.sendMessage(tabId, message, resolve)
      })
    },

    /** 向当前选中的 newtab 页面发送 message */
    activeSend: (message: MessageType<Action.Newtab>) => {
      return new Promise<any>(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          if (!tabs[0]?.id) return
          chrome.tabs.sendMessage(tabs[0].id, message, resolve)
        })
      })
    },

    /** 监听向 newtab 页面发送的 message 事件 */
    on: (
      action: Action.Newtab,
      callback: (
        message: MessageType<Action.Newtab>,
        sender: any,
        sendResponse: (data?: any) => void
      ) => void
    ) => {
      chrome.runtime.onMessage.addListener(
        (message: MessageType<Action.Newtab>, sender, sendResponse) => {
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
    send: (message: MessageType<Action.Background>) => {
      return new Promise<any>(resolve => {
        chrome.runtime.sendMessage(message, resolve)
      })
    },

    /** 监听向 background 发送的 message 事件 */
    on: (
      action: Action.Background,
      callback: (
        message: MessageType<Action.Background>,
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
    send: (target: Window, message: MessageType<Action.Window>) => {
      target.postMessage(message, '*')
    },

    /** 监听 window 之间的通信 */
    on: <T extends MessageType<Action.Window>>(
      action: Action.Window,
      callback: (event: MessageEvent<T>) => void
    ) => {
      window.addEventListener('message', (e: MessageEvent<T>) => {
        if (action === e.data.action) {
          callback?.(e)
        }
      })
    },
  },
}
