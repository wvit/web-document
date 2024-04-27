import { getI18n, getResource, catchLastError, qs } from '@/utils'
import { saveDocument } from './message'

catchLastError(chrome.contextMenus.create, {
  id: 'getPageData',
  title: getI18n('保存当前页面'),
  contexts: ['page'],
})

catchLastError(chrome.contextMenus.create, {
  id: 'getArticleData',
  title: getI18n('仅保存文章内容'),
  contexts: ['page'],
})

catchLastError(chrome.contextMenus.create, {
  id: 'openDocumentPage',
  title: getI18n('打开文档主页'),
  contexts: ['page'],
})

/** 监听右键菜单 */
chrome.contextMenus.onClicked.addListener(info => {
  const { menuItemId } = info

  if (['getPageData', 'getArticleData'].includes(menuItemId as string)) {
    saveDocument({ handleType: menuItemId })
  } else if (menuItemId === 'openDocumentPage') {
    chrome.tabs.create({
      url: getResource('/page/index.html'),
    })
  }
})

/** 点击chrome通知 */
chrome.notifications.onClicked.addListener(notificationId => {
  const { action, documentId } = qs.parse(notificationId)

  if (action === 'saveSuccess') {
    const url = qs.stringify({ documentId }, '/page/index.html')
    chrome.tabs.create({ url })
    catchLastError(chrome.notifications.clear, notificationId)
  }
})
