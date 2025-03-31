'use strict';

const Sequelize = require("sequelize");
module.exports = {
  up: async (queryInterface, any) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100)
      },
      surname: {
        type: Sequelize.STRING(100)
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      disabledAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, any) => {
    await queryInterface.dropTable('users');
  }
};
