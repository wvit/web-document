const textEncoder = new TextEncoder()

/** 获取内容占用磁盘空间大小 */
export const getStorageSize = content => {
  const dataEncode = textEncoder.encode(content)
  const storageSize = Number((dataEncode.length / 1024 / 1024).toFixed(2))
  return storageSize
}
