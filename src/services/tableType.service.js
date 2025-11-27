import prisma from '../config/prisma.config.js';

const tableTypeService = {};

tableTypeService.getAllTableTypes = async () => {
  const tableTypes = await prisma.tableType.findMany();
  return { tableTypes };
};
tableTypeService.createTableType = async (
  nameType,
  minSeat,
  maxSeat,
  storeId
) => {
  const tableType = await prisma.tableType.create({
    data: { nameType, minSeat, maxSeat, storeId },
  });
  return { tableType };
};
tableTypeService.updateTableType = async (
  id,
  nameType,
  minSeat,
  maxSeat,
  storeId
) => {
  const tableType = await prisma.tableType.update({
    where: { id },
    data: { nameType, minSeat, maxSeat, storeId },
  });
  return { tableType };
};
tableTypeService.deleteTableType = async (id) => {
  const tableType = await prisma.tableType.delete({
    where: { id },
  });
  return { tableType };
};

export { tableTypeService };
