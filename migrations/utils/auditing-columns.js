const auditingDateColumns = (Sequelize) => ({
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

const createAuditedTable = async (
  queryInterface,
  Sequelize,
  tableName,
  tableDefinition,
) => {
  await queryInterface.createTable(tableName, {
    ...tableDefinition,
    ...auditingDateColumns(Sequelize),
  });

  await queryInterface.createTrigger(
    tableName,
    updatedAtTriggerName(tableName),
    'before',
    ['update'],
    'set_updated_at',
    [],
  );
};

const updatedAtTriggerName = (tableName) => `${tableName}_updated_at`;

const rollbackAuditedTable = async (queryInterface, tableName) => {
  await queryInterface.dropTable(tableName);
  await queryInterface.dropTrigger(updatedAtTriggerName(tableName));
};

//TODO: es modules?
module.exports = {
  createAuditedTable,
  rollbackAuditedTable,
  auditingDateColumns,
  updatedAtTriggerName,
};
