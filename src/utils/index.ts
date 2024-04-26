export * from '@vorker/utils'
export * from './chrome'
export * from './message'

/** 转换字符串 */
export const transformStr = (
  /** 需要转换的字符串 */
  string: string,
  /** 转换类型 */
  type:
    | 'camelCase'
    | 'pascalCase'
    | 'lowercaseFirstLetter'
    | 'capitalizeFirstLetter',
  /** 字符串拼接符号 */
  joinSymbol?: string
) => {
  const getStr = (str, key: 'toUpperCase' | 'toLowerCase') => {
    return str.charAt(0)[key]() + str.slice(1)
  }

  if (['pascalCase', 'camelCase'].includes(type)) {
    /** 转换为大驼峰 */
    let newString = string
      .split(/[-_\s]/)
      .map(item => getStr(item, 'toUpperCase'))
      .join(joinSymbol || '')

    if (type === 'camelCase') {
      /** 转换为小驼峰 */
      newString = getStr(newString, 'toLowerCase')
    }

    return newString
  } else if (type === 'capitalizeFirstLetter') {
    /** 转换为首字母大写 */
    return getStr(string, 'toUpperCase')
  } else if (type === 'lowercaseFirstLetter') {
    /** 转换为首字母小写 */
    return getStr(string, 'toLowerCase')
  }

  return string
}
