'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createFunction(
      'set_updated_at',
      [],
      'TRIGGER',
      'plpgsql',
      `NEW.updated_at = NOW();
       RETURN NEW;`,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropFunction('set_updated_at');
  },
};
