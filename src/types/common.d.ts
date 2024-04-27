/** 偏好设置 */
declare type PreferenceSetting = {
  /** 列表展示类型 */
  listDisplayType: 'default' | 'domain'
  /** 页面图片保存类型 */
  imageSaveType: 'download' | 'url'
  /** 图片最大缓存限制 */
  imageDownloadMaxSize: number
}
