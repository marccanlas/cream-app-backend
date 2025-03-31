'use strict';

const Sequelize = require("sequelize");
module.exports = {
  up: async (queryInterface, any) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, any) => {
    await queryInterface.dropTable('roles');
  }
};