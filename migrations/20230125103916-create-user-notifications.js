'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_notifications', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['GENERAL', 'SALES', 'OFFERS']
      },
      table_name: {
        type: Sequelize.STRING(128)
      },
      table_id: {
        type: Sequelize.CHAR(36)
      },
      seen_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_notifications')
  }
}
