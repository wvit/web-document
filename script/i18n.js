import fs from 'node:fs'
import locales from './locales.json' assert { type: 'json' }

const i18nData = { en: {}, zh_CN: {} }

const writeFile = name => {
  fs.writeFileSync(
    `dist/_locales/${name}/messages.json`,
    JSON.stringify(i18nData[name], null, 2)
  )
}

Object.keys(locales).forEach(key => {
  const fieldName = locales[key].replace(/\s/g, '_')

  i18nData.zh_CN[fieldName] = { message: key }
  i18nData.en[fieldName] = { message: locales[key] }
})

writeFile('en')
writeFile('zh_CN')
