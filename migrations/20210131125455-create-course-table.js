'use strict';

const { rollbackTable, createTable } = require('./utils/table');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createTable(queryInterface, Sequelize, 'courses', {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
    });

    await queryInterface.addColumn('study_sessions', 'course_id', {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'courses',
      },
    });
  },

  down: async (queryInterface) => {
    await rollbackTable(queryInterface, 'courses');
    await queryInterface.removeColumn('study_sessions', 'course_id');
  },
};
