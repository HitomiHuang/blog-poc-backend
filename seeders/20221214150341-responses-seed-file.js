'use strict'
const { faker } = require('@faker-js/faker')
const crypto = require('crypto')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const stories = await queryInterface.sequelize.query('SELECT id FROM Stories', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const responses = []
    stories.forEach(story => {
      responses.push(...Array.from({ length: 3 }, () => ({
        id: crypto.randomBytes(6).toString('hex'),
        content: faker.lorem.text().substring(0, 50),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        story_id: story.id,
        created_at: new Date(),
        updated_at: new Date()
      })))
    })

    await queryInterface.bulkInsert('Responses', responses, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Responses', null, {})
  }
}
