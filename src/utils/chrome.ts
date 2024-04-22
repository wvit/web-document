import locales from '../../scripts/locales.json'

/** 操作chrome缓存 */
export const local = {
  /** 获取chrome数据缓存 */
  async get(key: string) {
    const store = await chrome.storage.local.get(key)
    return store[key]
  },

  /** 设置chrome数据缓存 */
  async set(data: any) {
    return chrome.storage.local.set(data)
  },

  /** 删除一个或多个缓存 */
  async remove(keys: string | string[]) {
    return chrome.storage.local.remove(keys)
  },
}

/** 获取chrome扩展资源 */
export const getResource = (resource: string) => chrome.runtime.getURL(resource)

/** 获取国际化字段 */
export const getI18n = (key: keyof typeof locales) => {
  let fieldName = locales[key] as string

  if (typeof fieldName === 'string') {
    fieldName = fieldName.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  } else {
    fieldName = key
  }

  return chrome.i18n.getMessage(fieldName)
}

/** 凡是没有提供 Promise 的 chrome api 都需要这个方法来捕获 chrome.runtime.lastError 报错。  */
export const catchLastError = (api, ...params) => {
  api(...params, () => {
    const lastError = chrome.runtime.lastError
    if (lastError) {
      console.log('last error:', lastError.message)
    }
  })
}
