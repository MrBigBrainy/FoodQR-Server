import prisma from '../config/prisma.config.js';

const tableService = {};

tableService.getAllTables = async () => {
  const tables = await prisma.table.findMany();
  return { tables };
};
tableService.getTableById = async (id) => {
  const table = await prisma.table.findUnique({
    where: { id },
  });
  return { table };
};
tableService.createTable = async (tableName, zoneId, tableTypeId, storeId) => {
  console.log('storeId', storeId);
  const table = await prisma.table.create({
    data: {
      tableName,

      store: {
        connect: { id: storeId },
      },
      tableType: {
        connect: { id: tableTypeId },
      },
      ...(zoneId && { zone: { connect: { id: zoneId } } }),
    },
  });
  return { table };
};
tableService.updateTable = async (id, tableName, zoneId, tableTypeId) => {
  const table = await prisma.table.update({
    where: { id },
    data: {
      tableName,
      zoneId,
      tableTypeId,
      ...(zoneId && { zone: { connect: { id: zoneId } } }),
    },
  });
  return { table };
};
tableService.deleteTable = async (id) => {
  const table = await prisma.table.delete({
    where: { id },
  });
  return { table };
};

export { tableService };
