'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('digis', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      social_network_media_id : {
        type: Sequelize.CHAR(128)
      },
      user_social_account_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'user_social_accounts' },
          key: 'id'
        }
      },
      user_account_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'user_accounts' },
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING(512)
      },
      description: {
        type: Sequelize.STRING(1024)
      },
      royalty_fee: {
        type: Sequelize.INTEGER
      },
      thumbnail_url: {
        type: Sequelize.STRING(2048)
      },
      source_url: {
        type: Sequelize.STRING(1024)
      },
      transcoded_urls: {
        type: Sequelize.JSON
      },
      likes: {
        type: Sequelize.INTEGER
      },
      launched_at: {
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
    await queryInterface.dropTable('digis')
  }
}
