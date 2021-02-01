'use strict';

const { rollbackTable, createTable } = require('./utils/table');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createTable(queryInterface, Sequelize, 'study_sessions', {
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      total_modules_studied: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      average_score: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      time_studied: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },

  down: async (queryInterface) => {
    await rollbackTable(queryInterface, 'study_sessions');
  },
};
