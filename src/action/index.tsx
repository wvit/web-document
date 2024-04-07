import { createRoot } from 'react-dom/client'
import ConfigProvider from 'antd/es/config-provider'
import zhCN from 'antd/es/locale/zh_CN'
import { PageStorage } from './PageStorage'
import '@/styles/common.less'

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="w-[800px] h-[600px] bg-[#f9f9f9] flex flex-col">
        <PageStorage />
      </div>
    </ConfigProvider>
  )
}

createRoot(document.querySelector('#app') as any).render(<App />)
