'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('digi_shares', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      digi_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'digis' },
          key: 'id'
        }
      },
      user_accounts_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'user_accounts' },
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('digi_shares')
  }
}
