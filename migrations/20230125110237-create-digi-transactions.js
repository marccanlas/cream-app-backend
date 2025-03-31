'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('digi_transactions', {
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
      buyer_account_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'user_accounts' },
          key: 'id'
        }
      },
      seller_account_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'user_accounts' },
          key: 'id'
        }
      },
      digi_transaction_id: {
        type: Sequelize.CHAR(36)
      },
      type: {
        type: Sequelize.ENUM,
        values: ['MINTED','OFFER','FORSALE','ACCEPTTED']
      },
      price: {
        type: Sequelize.FLOAT(10, 2)
      },
      transaction_hash: {
        type: Sequelize.STRING(255)
      },
      start_at: {
        type: Sequelize.DATE
      },
      end_at: {
        type: Sequelize.DATE
      },
      rejected_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('digi_transactions')
  }
}
