import zip from 'cross-zip'

zip.zipSync('./dist', `./chrome-extension.zip`)
