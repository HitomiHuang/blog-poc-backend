'use strict'
const { faker } = require('@faker-js/faker')
const generator = require('../util/id-generator')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const stories = []
    const status = ['draft', 'published']

    for (let j = 0; j < users.length; j++) {
      for (let i = 0; i < 5; i++) {
        const text = await faker.lorem.text().substring(0, 100)
        await stories.push({
          id: await generator(text),
          title: text,
          content: await faker.lorem.paragraphs(3),
          status: status[Math.floor(Math.random() * 2)],
          user_id: users[j].id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Stories', stories, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Stories', null, {})
  }
}
