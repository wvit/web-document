import { memo, useState, useEffect, useRef } from 'react'
import flexSearch from 'flexsearch'
import { storeHandles } from '@/utils/idb'
import { Header } from '../Header'
import { DocumentList } from '../DocumentList'

/** 文档索引字段 */
const documentFields = { title: '标题', textContent: '内容', href: '链接' }

/** 文档主页布局 */
export const Layout = memo(() => {
  const [pageList, setPageList] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchKeywords, setSearchKeywords] = useState<string[]>([])
  const [activePageData, setActivePageData] = useState<any>(null)
  const documentRef = useRef({} as flexSearch.Document<any, string[]>)

  /** 是否为搜索状态 */
  const searchStatus = !!searchKeywords.length

  /** 获取当前已保存的页面列表 */
  const getPageList = async () => {
    const { list } = await storeHandles.document.getAll()

    documentRef.current = new flexSearch.Document({
      // encode: str => str.replace(/[\x00-\x7F]/g, '').split(''),
      document: { id: 'id', index: Object.keys(documentFields) },
    })
    list.forEach(item => {
      documentRef.current.add(item)
    })

    setPageList(list)
  }

  /** 对搜索结果数据进行转换、排序等处理 */
  const transformSearchResult = (resultMap, resultIds) => {
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
        const findItem = pageList.find(item => item.id === id)

        return {
          ...findItem,
          searchSort: keywords.length * fieldCount,
          searchResult: searchData,
        }
      })
      .sort((a, b) => b.searchSort - a.searchSort)

    return fillResults
  }

  /** 搜索文档内容 */
  const searchDocument = () => {
    /** 被搜索关键字命中的数据id */
    const resultIds: string[][] = []

    /** 生成数据结构：{ [keyword]: { [field]: ids[] } } */
    const searchResultMap = searchKeywords.reduce(
      (prevSearchResult, keyword) => {
        const results = documentRef.current.search({
          query: keyword,
        }) as { field: string; result: string[] }[]

        const resultMap = results.reduce((prevFieldResult, fieldResult) => {
          const { field, result } = fieldResult

          resultIds.push(result)
          return { ...prevFieldResult, [field]: result }
        }, {}) as Record<string, string[]>

        return { ...prevSearchResult, [keyword]: resultMap }
      },
      {}
    ) as Record<string, Record<string, string[]>>

    const results = transformSearchResult(searchResultMap, resultIds)

    setSearchResults(results)
  }

  useEffect(() => {
    getPageList()
  }, [])

  useEffect(() => {
    if (searchStatus) searchDocument()
  }, [searchKeywords])

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f0f0f0] flex flex-col">
      <Header
        onLogoClick={() => setActivePageData(null)}
        onSearch={setSearchKeywords}
      />

      <div className="flex flex-1 h-[0]">
        <DocumentList
          searchStatus={searchStatus}
          documents={searchStatus ? searchResults : pageList}
          activeData={activePageData}
          onSelect={data => setActivePageData(data)}
        />
        {activePageData && (
          <div className=" w-[100%] mt-3 mr-3">
            <iframe
              className="page-content w-[100%] h-[100%]"
              srcDoc={activePageData.htmlContent}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  )
})
