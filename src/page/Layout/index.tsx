import { memo, useState, useEffect, useRef } from 'react'
import theme from 'antd/es/theme'
import flexSearch from 'flexsearch'
import { storeHandles } from '@/utils/idb'
import { Header } from '../Header'

/** 文档索引字段 */
const documentFields = [
  { label: '标题', value: 'title' },
  { label: '内容', value: 'textContent' },
  { label: '链接', value: 'href' },
]

/** 文档主页布局 */
export const Layout = memo(() => {
  const [pageList, setPageList] = useState<any[]>([])
  const [activePageData, setActivePageData] = useState<any>(null)
  const documentRef = useRef({} as flexSearch.Document<any, string[]>)
  const { token } = theme.useToken()

  /** 获取当前已保存的页面列表 */
  const getPageList = async () => {
    const { list } = await storeHandles.pages.getAll()

    documentRef.current = new flexSearch.Document({
      // encode: str => str.replace(/[\x00-\x7F]/g, '').split(''),
      document: { id: 'id', index: documentFields.map(item => item.value) },
    })
    list.forEach(item => {
      documentRef.current.add(item)
    })

    setPageList(list)
  }

  /** 转换搜索结果数据结构，按字段进行分类 */
  const transformSearchResults = searchResults => {
    /** 被搜索关键字命中的数据id */
    const resultIds: string[][] = []
    /** 生成数据结构：{ [field]: { [keyword]: ids[] } } */
    const fieldResultMap = documentFields.reduce((prevFeild, field) => {
      /** 生成数据结构：{ [keyword]: ids[] } */
      const keywordResult = searchResults.reduce(
        (prevKeywordResult, keywordResult) => {
          const { keyword, results } = keywordResult
          const ids =
            results.find(item => item.field === field.value)?.result || []

          resultIds.push(ids)
          return { ...prevKeywordResult, [keyword]: ids }
        },
        {} 
      ) as Record<string, string[]>

      return { ...prevFeild, [field.value]: keywordResult }
    }, {}) as Record<string, Record<string, string[]>>

    return {
      fieldResultMap,
      resultIds: Array.from(new Set(resultIds.flat())),
    }
  }

  /** 对转换后的搜索结果数据进行排序等处理 */
  const sortResultMap = resultData => {
    const { fieldResultMap, resultIds } = resultData
    const getSearchData = id => {
      const searchData = {}

      Object.keys(fieldResultMap).forEach(field => {
        const fieldMap = fieldResultMap[field]

        Object.keys(fieldMap).forEach(keyword => {
          if (fieldMap[keyword].includes(id)) {
            searchData[field] = [...(searchData[field] || []), keyword]
          }
        })
      })

      return searchData as Record<string, string[]>
    }
    const fillResults = resultIds
      .map(id => {
        const searchData = getSearchData(id)
        const searchFields = Object.keys(searchData)
        const keywordCount = searchFields.reduce((prevCount, field) => {
          return prevCount + searchData[field].length
        }, 0)
        const findItem = pageList.find(item => item.id === id)

        return {
          ...findItem,
          searchSort: searchFields.length * keywordCount,
          searchResult: searchData,
        }
      })
      .sort((a, b) => b.searchSort - a.searchSort)

    return fillResults
  }

  /** 搜索文档内容 */
  const searchDocument = (keywords: string[]) => {
    const searchResults = keywords.map(keyword => {
      const results = documentRef.current.search({
        query: keyword,
      }) as { field: string; result: string[] }[]

      return { keyword, results }
    })
    const resultData = transformSearchResults(searchResults)
    const sortResults = sortResultMap(resultData)

    console.log(11111,searchResults, resultData)
  }

  useEffect(() => {
    getPageList()
  }, [])

  return (
    <div className="w-[100vw] h-[100vh] bg-[#f0f0f0] flex flex-col">
      <Header
        onLogoClick={() => setActivePageData(null)}
        onSearch={searchDocument}
      />

      <div className="flex flex-1 h-[0]">
        <ul
          className="p-1 flex flex-wrap flex-row max-h-[100%] h-fit overflow-x-hidden overflow-y-auto"
          style={{
            width: activePageData ? '300px' : '100%',
          }}
        >
          {pageList.map(item => {
            const { href, title } = item

            return (
              <li
                key={href}
                className="card-item m-2 cursor-pointer max-w-[100%] h-[100px]"
                style={{
                  width: activePageData ? '95%' : '300px',
                  border:
                    activePageData?.href === href
                      ? `1px solid ${token.colorPrimary}`
                      : 'none',
                }}
              >
                <h3
                  title={title}
                  className="line-clamp-2"
                  onClick={() => {
                    setActivePageData(
                      activePageData?.href === href ? null : item
                    )
                  }}
                >
                  {title}
                </h3>
                <a
                  title={href}
                  href={href}
                  target="_blank"
                  className="line-clamp-2 mt-1"
                  style={{ color: token.colorLink, overflowWrap: 'anywhere' }}
                >
                  {href}
                </a>
              </li>
            )
          })}
        </ul>
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
