'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // const users = queryInterface.sequelize.query('SELECT ', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 3 }, (_, i) => ({
        user_name: `@user${i + 1}`,
        name: faker.name.fullName(),
        password: '12345678',
        email: faker.internet.exampleEmail(),
        bio: faker.lorem.text().substring(0, 50),
        created_at: new Date(),
        updated_at: new Date()
      })))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
