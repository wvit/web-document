import { Handle, IDB } from '@vorker/idb'

/** 实例化数据库 */
const db = new IDB({
  name: 'web-document',
  storeNames: ['document', 'resource'] as const,
  objectNames: ['globalConfig'] as const,
})

/** 生成数据表的操作方法 */
export const { storeHandles, objectHandles } = new Handle({ db })
