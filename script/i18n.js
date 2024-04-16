import fs from 'node:fs'
import locales from './locales.json' assert { type: 'json' }

const i18nData = { en: {}, zh_CN: {} }

const writeFile = name => {
  const content = JSON.stringify(i18nData[name], null, 2)

  fs.writeFileSync(`public/_locales/${name}/messages.json`, content)
  fs.writeFileSync(`dist/_locales/${name}/messages.json`, content)
}

Object.keys(locales).forEach(key => {
  const fieldName = locales[key]
    .replace(/\s/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')

  i18nData.zh_CN[fieldName] = { message: key }
  i18nData.en[fieldName] = { message: locales[key] }
})

writeFile('en')
writeFile('zh_CN')
