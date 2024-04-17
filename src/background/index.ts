import { getI18n, getResource, catchLastError, qs } from '@/utils'
import { saveDocument } from './message'

catchLastError(chrome.contextMenus.create, {
  id: 'savePage',
  title: getI18n('保存当前页面'),
  contexts: ['page'],
})

catchLastError(chrome.contextMenus.create, {
  id: 'saveArticle',
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

  if (['savePage', 'saveArticle'].includes(menuItemId as string)) {
    saveDocument({ handleType: menuItemId })
  } else if (menuItemId === 'openDocumentPage') {
    chrome.tabs.create({
      url: getResource('/page/index.html'),
    })
  }
})

/** 点击chrome通知 */
chrome.notifications.onClicked.addListener(notificationId => {
  const documentId = notificationId.slice(10)
  const url = qs.stringify({ documentId }, '/page/index.html')

  chrome.tabs.create({ url })
  catchLastError(chrome.notifications.clear, notificationId)
})
