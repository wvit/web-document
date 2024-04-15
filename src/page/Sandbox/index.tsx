import { memo, useEffect, useState } from 'react'
import { storeHandles } from '@/utils/idb'

export interface SandboxProps {
  /** 当前选中的数据 */
  activeData: any
}

/** 展示已缓存页面的沙盒组件 */
export const Sandbox = memo((props: SandboxProps) => {
  const { activeData } = props
  const { styleLinks, htmlContent } = activeData || {}
  const [iframeSrcDoc, setIframeSrcDoc] = useState(htmlContent)

  /** 获取页面所需资源 */
  const getPageResource = async () => {
    const results = await storeHandles.resource.getIds(styleLinks || [])
    const styles = results
      .filter(item => item.type === 'css')
      .map(item => {
        const { id, content, createDate } = item
        return `<style data-src="${id}" data-date="${createDate}">${content}</style>`
      })
      .join('\n')

    setIframeSrcDoc(`${styles} ${htmlContent}`)
  }

  useEffect(() => {
    if (activeData) getPageResource()
  }, [activeData])

  if (!activeData) return null
  return (
    <div className=" w-[100%] mt-3 mr-3">
      <iframe
        className="page-content w-[100%] h-[100%]"
        srcDoc={iframeSrcDoc}
      ></iframe>
    </div>
  )
})
