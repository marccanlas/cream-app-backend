'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_accounts', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'users' },
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING(255)
      },
      bio: {
        type: Sequelize.STRING(2048)
      },
      avatar: {
        type: Sequelize.STRING(1024)
      },
      cover: {
        type: Sequelize.STRING(1024)
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_accounts')
  }
}
