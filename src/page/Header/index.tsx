import { memo } from 'react'
import Select from 'antd/es/select'
import { getResource } from '@/utils'

/** 搜索栏等头部组件 */
export const Header = memo(() => {
  return (
    <div className=" h-14 bg-[#fff] px-3 flex items-center">
      <img src={getResource('/icon.png')} className="h-[100%]" />
      <div className="">
        <Select
          size="large"
          mode="tags"
          className="w-[500px] ml-20"
          placeholder="请输入需要查找的文档标题、内容、网址"
          // value={getPreference('companyNames')}
          // onChange={e => onChange('companyNames', e)}
          // options={getTagOptions(jobList.map(item => item.brandName))}
        />
      </div>
    </div>
  )
})
