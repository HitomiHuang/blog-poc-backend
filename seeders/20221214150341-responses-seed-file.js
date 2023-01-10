'use strict'
const { faker } = require('@faker-js/faker')
const generator = require('../util/id-generator')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const stories = await queryInterface.sequelize.query('SELECT id, title FROM Stories', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const responses = []
    for (let j = 0; j < stories.length; j++) {
      for (let i = 0; i < 3; i++) {
        const text = await faker.lorem.text().substring(0, 200)
        await responses.push({
          id: await generator(text),
          content: text,
          user_id: users[Math.floor(Math.random() * users.length)].id,
          story_id: stories[j].id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Responses', responses, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Responses', null, {})
  }
}
