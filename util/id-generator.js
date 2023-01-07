// const { Story } = require('../models')
import cryptoRandomString from 'crypto-random-string'

const generator = async length => {
  // const box = 'abcdefghijklmnopqrstuvwxyz1234567890'
  // let randomString = ''
  // const storyIdsOfUser = await Story.findAll({
  //   where: { userId: user },
  //   attributes: ['id']
  // })

  // for (let i = 0; i < length; i++) {
  //   randomString += box[Math.floor(Math.random() * 36)]
  // }

  return cryptoRandomString({ length })
}
module.exports = generator
