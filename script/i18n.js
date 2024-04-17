import fs from 'node:fs'
import locales from './locales.json' assert { type: 'json' }

const i18nData = { en: {}, zh_CN: {} }

const writeFile = name => {
  const content = JSON.stringify(i18nData[name], null, 2)

  fs.writeFileSync(`public/_locales/${name}/messages.json`, content)
  fs.writeFileSync(`dist/_locales/${name}/messages.json`, content)
}

Object.keys(locales).forEach(key => {
  let value = locales[key]

  if (typeof value === 'string') {
    /** [zh_CN]: [en] 场景 */
    value = value.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '')

    i18nData.zh_CN[value] = { message: key }
    i18nData.en[value] = { message: locales[key] }
  } else {
    /** [field]: { zh_CN: [zh_CN], en: [en] } 场景 */
    i18nData.zh_CN[key] = { message: value['zh_CN'] }
    i18nData.en[key] = { message: value['en'] }
  }
})

writeFile('en')
writeFile('zh_CN')
