import { memo, useEffect, useState } from 'react'
import Select from 'antd/es/select'
import { getResource } from '@/utils'
import { objectHandles } from '@/utils/idb'

export interface HeaderProps {
  /** 点击logo */
  onLogoClick?: () => void
  /** 搜索内容 */
  onSearch?: (keywords: string[]) => void
}

/** 搜索栏等头部组件 */
export const Header = memo((props: HeaderProps) => {
  const { onLogoClick, onSearch } = props
  const [searchOptions, setSearchOptions] = useState([])

  /** 获取搜索快捷选项 */
  const getSearchOptions = async () => {
    const { searchOptions: options } = await objectHandles.globalConfig.get()
    setSearchOptions(options || [])
  }

  /** 搜索关键字 */
  const searchKeywords = async keywords => {
    const options = Array.from(
      new Set([...keywords, ...searchOptions].slice(0, 20))
    )

    onSearch?.(keywords)
    await objectHandles.globalConfig.set({ searchOptions: options })
    getSearchOptions()
  }

  useEffect(() => {
    getSearchOptions()
  }, [])

  return (
    <div className=" h-14 bg-[#fff] px-3 flex items-center">
      <img
        src={getResource('/icon.png')}
        className="h-[100%] cursor-pointer"
        onClick={onLogoClick}
      />
      <div className="">
        <Select
          size="large"
          mode="tags"
          className="min-w-[500px] max-w-[700px] ml-20"
          maxTagCount={5}
          placeholder="请输入需要查找的文档标题、内容、网址"
          onChange={searchKeywords}
          options={searchOptions.map(item => ({ label: item, value: item }))}
        />
      </div>
    </div>
  )
})
