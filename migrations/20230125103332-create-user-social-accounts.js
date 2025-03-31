'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_social_accounts', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      user_account_id: {
        type: Sequelize.CHAR(36),
        references: {
          model: { tableName: 'user_accounts' },
          key: 'id'
        }
      },
      platform_username: {
        type: Sequelize.STRING(1024)
      },
      // platform_id: {
      //   type: Sequelize.CHAR(256)
      // },
      // platform_media_count: {
      //   type: Sequelize.INTEGER
      // },
      network: {
        type: Sequelize.ENUM,
        values: ['META','INSTAGRAM','YOUTUBE','TIKTOK']
      },
      oauth: {
        type: Sequelize.STRING(2048)
      },
      oauth_expired_at: {
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
    await queryInterface.dropTable('user_social_accounts')
  }
}
