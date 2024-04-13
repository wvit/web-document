import { createRoot } from 'react-dom/client'
import ConfigProvider from 'antd/es/config-provider'
import zhCN from 'antd/es/locale/zh_CN'
import { Layout } from './Layout'
import '@/styles/common.less'

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="w-[800px] h-[600px] bg-[#f0f0f0] flex flex-col">
        <Layout />
      </div>
    </ConfigProvider>
  )
}

createRoot(document.querySelector('#app') as any).render(<App />)
