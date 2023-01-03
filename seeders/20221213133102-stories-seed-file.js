'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const stories = []

    users.forEach(user => {
      stories.push(...Array.from({ length: 5 }, () => ({
        content: faker.lorem.paragraphs(3),
        status: 'published',
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