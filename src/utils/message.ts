import { registerMessage } from '@vorker/chrome'

/** 区分 chrome.runtime.message 的 action 操作类型 */
export namespace Action {
  export enum Content {
    /** 获取页面文档数据 */
    GetDocumentData = 'getDocumentData',
  }

  export enum Action {
    /** 刷新页面文档数据 */
    RefreshDocumentData = 'refreshDocumentData',
  }

  export enum Background {
    /** 在后台中操作IDB */
    HandleIDB = 'handleIDB',
    /** 保存页面文档内容 */
    SaveDocument = 'saveDocument',
    /** 缓存远程资源 */
    CacheResource = 'cacheResource',
    /** 替换缓存资源的fetch方法，处理获取部分资源跨域问题 */
    Fetch = 'fetch',
  }
}

/** 消息管理器 */
export const Message = registerMessage([
  {
    name: 'content',
    type: 'tabs',
    action: Action.Content,
  },
  {
    name: 'action',
    type: 'normal',
    action: Action.Action,
  },
  {
    name: 'background',
    type: 'normal',
    action: Action.Background,
  },
] as const)
