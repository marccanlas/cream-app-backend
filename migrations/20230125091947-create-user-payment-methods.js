'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_payment_methods', {
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
      type: {
        type: Sequelize.ENUM,
        values: ['PAYIN', 'PAYOUT']
      },
      card_name: {
        type: Sequelize.STRING(255)
      },
      card_number: {
        type: Sequelize.STRING(45)
      },
      card_expiry: {
        type: Sequelize.STRING(45)
      },
      card_cvc: {
        type: Sequelize.STRING(45)
      },
      card_postcode: {
        type: Sequelize.STRING(45)
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_payment_methods')
  }
}
