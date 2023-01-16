const crypto = require('crypto')

const generator = async content => {
  const contentArray = content.substring(0, 100).split('\n')
  const regex = /[^\u4E00-\u9FA5A-Za-z0-9\s]/g
  const str1 = contentArray[0].replace(regex, '')

  const str2 = str1.toLowerCase().trim()
  const stringCrypto = str2.replace(/[\s]/g, '-')
  const idCrypto = crypto.randomBytes(6).toString('hex')

  return [`${stringCrypto}-${idCrypto}`, stringCrypto, idCrypto]
}
module.exports = generator
