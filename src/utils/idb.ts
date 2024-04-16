import { Handle, IDB } from '@vorker/idb'

/** 实例化数据库 */
const db = new IDB({
  name: 'web-document',
  storeNames: ['document', 'resource'] as const,
  objectNames: ['globalConfig'] as const,
})

/** 生成数据表的操作方法 */
export const { storeHandles, objectHandles } = new Handle({ db })

/** 获取按域名分类的文档列表数据 */
export const useDomainList = async documentList => {
  const { list } = await storeHandles.resource.getAll()
  const domainList: any[] = []
  const resourceMap = list.reduce((prev, resource) => {
    const { domain } = resource
    return { ...prev, [domain]: [...(prev[domain] || []), resource] }
  }, {})

  documentList.forEach(item => {
    const { domain } = item
    const findData = domainList.find(item => item.domain === domain)
    const styleSize =
      resourceMap[domain]?.reduce((prev, resouce) => {
        return prev + resouce.contentSize
      }, 0) || 0

    if (findData) {
      findData.children.push(item)
    } else {
      domainList.push({
        domain,
        styleSize: styleSize.toFixed(2),
        children: [item],
      })
    }
  })

  return domainList.sort((a, b) => (a.domain > b.domain ? 1 : -1))
}
