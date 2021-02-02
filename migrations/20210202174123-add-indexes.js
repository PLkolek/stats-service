'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex('study_sessions', ['user_id', 'course_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('study_sessions', [
      'user_id',
      'course_id',
    ]);
  },
};
