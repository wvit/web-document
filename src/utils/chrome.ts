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

/** 获取标签页列表中，为 newtab 的页面 */
export const getNewtabs = async () => {
  return new Promise<any[]>(resolve => {
    chrome.tabs.query({ url: 'chrome://newtab/' }, tabs => {
      resolve(tabs)
    })
  })
}
