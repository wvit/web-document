import { memo, useEffect, useState, useRef, useCallback } from 'react'
import flexSearch from 'flexsearch'
import Select from 'antd/es/select'
import { getI18n, getResource } from '@/utils'
import { storeHandles, objectHandles } from '@/utils/idb'

/** 文档索引字段 */
const documentFields = {
  title: getI18n('标题'),
  textContent: getI18n('内容'),
  href: getI18n('链接'),
}

export interface HeaderProps {
  /** 数据列表发生改变 */
  onChange: (documentList: any[], searchStatus: boolean) => void
  /** 点击logo */
  onLogoClick?: () => void
}

/** 搜索栏等头部组件 */
export const Header = memo((props: HeaderProps) => {
  const { onLogoClick, onChange } = props
  const [documentList, setDocumentList] = useState<any[]>([])
  const [searchOptions, setSearchOptions] = useState([])
  const documentRef = useRef({} as flexSearch.Document<any, string[]>)

  /** 获取当前已保存的页面列表 */
  const getPageList = useCallback(async () => {
    const { list } = await storeHandles.document.getAll()

    documentRef.current = new flexSearch.Document({
      // encode: str => str.replace(/[\x00-\x7F]/g, '').split(''),
      document: { id: 'id', index: Object.keys(documentFields) },
    })
    list.forEach(item => {
      documentRef.current.add(item)
    })

    setDocumentList(list)
    onChange?.(list, false)
  }, [])

  /** 获取搜索快捷选项 */
  const getSearchOptions = useCallback(async () => {
    const { searchOptions } = await objectHandles.globalConfig.get()
    setSearchOptions(searchOptions || [])
  }, [])

  /** 对搜索结果数据进行转换、排序等处理 */
  const transformSearchResult = useCallback(
    (resultMap, resultIds) => {
      /** 获取每条数据的搜索总结 */
      const getSearchData = id => {
        const searchData = {}

        Object.keys(resultMap).forEach(keyword => {
          const keywordMap = resultMap[keyword]

          Object.keys(keywordMap).forEach(field => {
            if (keywordMap[field].includes(id)) {
              searchData[keyword] = [
                ...(searchData[keyword] || []),
                documentFields[field],
              ]
            }
          })
        })

        return searchData as Record<string, string[]>
      }

      /** 填充搜索结果数据 */
      const fillResults = Array.from(new Set(resultIds.flat()))
        .map(id => {
          const searchData = getSearchData(id)
          const keywords = Object.keys(searchData)
          const fieldCount = keywords.reduce((prevCount, keyword) => {
            return prevCount + searchData[keyword].length
          }, 0)
          const findItem = documentList.find(item => item.id === id)

          return {
            ...findItem,
            searchSort: keywords.length * fieldCount,
            searchResult: searchData,
          }
        })
        .sort((a, b) => b.searchSort - a.searchSort)

      return fillResults
    },
    [documentList]
  )

  /** 搜索文档内容 */
  const getSearchResults = useCallback(
    keywords => {
      /** 被搜索关键字命中的数据id */
      const resultIds: string[][] = []

      /** 生成数据结构：{ [keyword]: { [field]: ids[] } } */
      const searchResultMap = keywords.reduce((prevSearchResult, keyword) => {
        const results = documentRef.current.search({
          query: keyword,
        }) as { field: string; result: string[] }[]

        const resultMap = results.reduce((prevFieldResult, fieldResult) => {
          const { field, result } = fieldResult

          resultIds.push(result)
          return { ...prevFieldResult, [field]: result }
        }, {}) as Record<string, string[]>

        return { ...prevSearchResult, [keyword]: resultMap }
      }, {}) as Record<string, Record<string, string[]>>

      const results = transformSearchResult(searchResultMap, resultIds)

      return results
    },
    [transformSearchResult]
  )

  /** 搜索关键字 */
  const searchDocuments = useCallback(
    async keywords => {
      const options = Array.from(
        new Set([...keywords, ...searchOptions].slice(0, 20))
      )
      const searchResults = getSearchResults(keywords)
      const searchStatus = !!keywords.length

      onChange?.(searchStatus ? searchResults : documentList, searchStatus)
      await objectHandles.globalConfig.set({ searchOptions: options })
      getSearchOptions()
    },
    [searchOptions, getSearchResults]
  )

  useEffect(() => {
    getPageList()
    getSearchOptions()
  }, [])

  return (
    <div className=" h-14 bg-[#fff] px-3 flex items-center">
      <img
        src={getResource('/icon.png')}
        className="h-[100%] cursor-pointer"
        onClick={() => onLogoClick?.()}
      />
      <div className="">
        <Select
          size="large"
          mode="tags"
          className="min-w-[500px] max-w-[700px] ml-20 placeholder-xs"
          placeholder={getI18n('请输入需要查找的标题、内容、网址')}
          maxTagCount={5}
          onChange={searchDocuments}
          options={searchOptions.map(item => ({ label: item, value: item }))}
        />
      </div>
    </div>
  )
})
