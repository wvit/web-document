import { i18n } from '@vorker/chrome'

/** 国际化配置数据 */
export const locales = [
  {
    key: 'description',
    zh_CN:
      '用于在浏览器环境保存网页文档，方便在没有网络和快速查找网页内容的情况下使用，还能为您节约浏览器的使用内存。',
    en: 'Stores web pages locally in browsers, enabling offline use and saving browser memory.',
  },
  {
    zh_CN: '网页文档',
    en: 'web document',
  },
  {
    zh_CN: '保存当前页面',
    en: 'Save current page',
  },
  {
    zh_CN: '仅保存文章内容',
    en: 'Save article content only',
  },
  {
    zh_CN: '打开文档主页',
    en: 'Open document homepage',
  },
  {
    zh_CN: '全选',
    en: 'Select all',
  },
  {
    zh_CN: '删除所选项',
    en: 'Delete selected items',
  },
  {
    zh_CN: '默认排列',
    en: 'Default sorting',
  },
  {
    zh_CN: '按网站排列',
    en: 'Sort by website',
  },
  {
    zh_CN: '删除成功',
    en: 'Deletion successful',
  },
  {
    zh_CN: '是否确认删除所选页面文档?',
    en: 'Are you sure you want to delete the selected page document?',
  },
  {
    zh_CN: '取消',
    en: 'Cancel',
  },
  {
    zh_CN: '确认',
    en: 'Confirm',
  },
  {
    zh_CN: '保存完成，点击查看',
    en: 'Save complete, click to view',
  },
  {
    zh_CN: '标题',
    en: 'Title',
  },
  {
    zh_CN: '内容',
    en: 'Content',
  },
  {
    zh_CN: '链接',
    en: 'URL',
  },
  {
    zh_CN: '请输入需要查找的标题、内容、网址',
    en: 'Please enter the title, content, or URL you want to search for',
  },
  {
    zh_CN: '暂无搜索数据，请换一个关键词试试吧',
    en: 'No search data found, please try another keyword',
  },
  {
    zh_CN: '暂无数据',
    en: 'No data available',
  },
  {
    zh_CN: '包含',
    en: 'Contains',
  },
  {
    zh_CN: '中包含此关键词',
    en: 'Contains this keyword',
  },
  {
    zh_CN: '保存失败，请刷新页面后重试',
    en: 'Save failed, please refresh the page and try again.',
  },
  {
    zh_CN: '导出所选项',
    en: 'Export selected items',
  },
  {
    zh_CN: '是否确认导出所选页面文档?',
    en: 'Are you sure you want to export the selected page documents?',
  },
  {
    zh_CN: '批量导入',
    en: 'Batch import',
  },
  {
    zh_CN: '正在下载，请稍后',
    en: 'Downloading, please wait.',
  },
  {
    zh_CN: '确认下载',
    en: 'Confirm download.',
  },
  {
    zh_CN: '请输入您需要导入的URL地址',
    en: 'Please enter the URL you wish to import.',
  },
  {
    zh_CN: '确认导入',
    en: 'Confirm import',
  },
  {
    zh_CN: '取消导入',
    en: 'Cancel import',
  },
  {
    zh_CN: '从URL导入',
    en: 'Import from URL',
  },
  {
    zh_CN: '上传JSON文件',
    en: 'Upload JSON file',
  },
  {
    zh_CN: '导入URL地址失败',
    en: 'Failed to import URL',
  },
  {
    zh_CN: '导入失败，请确认文档内容后重试',
    en: 'Import failed, please verify document content and try again',
  },
  {
    zh_CN: '导入完成',
    en: 'Import completed',
  },
  {
    zh_CN: '请选择需要导入的文档',
    en: 'Please select the document to import',
  },
  {
    zh_CN: '偏好设置',
    en: 'Preferences',
  },
  {
    zh_CN: '下载并缓存',
    en: 'Download and Cache',
  },
  {
    zh_CN: '保留原始URL',
    en: 'Keep original URL',
  },
  {
    zh_CN: '图片保存方式',
    en: 'Image saving method',
  },
  {
    zh_CN: '排列方式',
    en: 'Arrangement method',
  },
  {
    zh_CN: '保存',
    en: 'Save',
  },
  {
    zh_CN: '超过此大小的图片将会被忽略',
    en: 'Images larger than this size will be ignored',
  },
  {
    zh_CN: '最大缓存图片',
    en: 'Maximum cached images',
  },
] as const

/** 获取国际化字段 */
export const getI18n = i18n.init(locales)
