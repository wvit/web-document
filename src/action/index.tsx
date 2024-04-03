import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import ConfigProvider from 'antd/es/config-provider'
import zhCN from 'antd/es/locale/zh_CN'
import '@/styles/common.less'

const App = () => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const { action, htmlContent } = message
      if (action === 'renderHtml') {
        const iframe: any = document.querySelector('.html-container')

        iframe.srcdoc = htmlContent

        sendResponse()
        return true
      }
    })
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <div className="w-[800px] h-[600px] p-2 bg-[#f9f9f9] flex flex-col">
        <iframe className="html-container"></iframe>
      </div>
    </ConfigProvider>
  )
}

createRoot(document.querySelector('#app') as any).render(<App />)
