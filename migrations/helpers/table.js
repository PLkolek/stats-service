const {
  createAuditedTable,
  rollbackAuditedTable,
} = require('./auditing-columns');

const createTable = async (
  queryInterface,
  Sequelize,
  tableName,
  tableDefinition,
) => {
  await createAuditedTable(queryInterface, Sequelize, tableName, {
    ...tableDefinition,
    ...idColumn(Sequelize),
  });
};

const rollbackTable = async (queryInterface) => {
  await rollbackAuditedTable(queryInterface);
};

const idColumn = (Sequelize) => ({
  id: {
    allowNull: false,
    primaryKey: true,
    type: 'uuid',
    defaultValue: Sequelize.fn('uuid_generate_v4'),
  },
});

module.exports = {
  createTable,
  rollbackTable,
  idColumn,
};
