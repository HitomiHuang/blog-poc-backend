'use strict'
const { faker } = require('@faker-js/faker')
const crypto = require('crypto')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const stories = []
    const status = ['draft', 'published']

    users.forEach(user => {
      stories.push(...Array.from({ length: 5 }, () => ({
        id: crypto.randomBytes(6).toString('hex'),
        title: faker.lorem.text().substring(0, 20),
        content: faker.lorem.paragraphs(3),
        status: status[Math.floor(Math.random() * 2)],
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      )
    })

    await queryInterface.bulkInsert('Stories', stories, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Stories', null, {})
  }
}
