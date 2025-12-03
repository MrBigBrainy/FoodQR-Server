// import prisma from '../config/prisma.config.js';

// const tableTypeService = {};

// tableTypeService.getAllTableTypes = async () => {
//   const tableTypes = await prisma.tableType.findMany();
//   return { tableTypes };
// };
// tableTypeService.createTableType = async (
//   nameType,
//   minSeat,
//   maxSeat,
//   storeId
// ) => {
//   const tableType = await prisma.tableType.create({
//     data: { nameType, minSeat, maxSeat, storeId },
//   });
//   return { tableType };
// };
// tableTypeService.updateTableType = async (
//   id,
//   nameType,
//   minSeat,
//   maxSeat,
//   storeId
// ) => {
//   const tableType = await prisma.tableType.update({
//     where: { id },
//     data: { nameType, minSeat, maxSeat, storeId },
//   });
//   return { tableType };
// };
// tableTypeService.deleteTableType = async (id) => {
//   const tableType = await prisma.tableType.delete({
//     where: { id },
//   });
//   return { tableType };
// };

// export { tableTypeService };

import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { tableTypes } from '../../drizzle/schema.js';

const tableTypeService = {};

// --- READ ---
tableTypeService.getAllTableTypes = async () => {
  const tableTypesList = await db.select().from(tableTypes);
  return { tableTypes: tableTypesList };
};
//--- get by id---
tableTypeService.getTableTypeById = async (id) => {
  const result = await db
    .select()
    .from(tableTypes)
    .where(eq(tableTypes.id, id));

  return {
    tableType: result[0] || null,
  };
};

// --- CREATE ---
tableTypeService.createTableType = async (
  nameType,
  minSeat,
  maxSeat,
  storeId
) => {
  const result = await db.insert(tableTypes).values({
    nameType,
    minSeat,
    maxSeat,
    storeId,
  });

  // result.insertId = ID ที่พึ่งสร้าง
  return {
    tableType: {
      id: result.insertId,
      nameType,
      minSeat,
      maxSeat,
      storeId,
    },
  };
};

// --- UPDATE ---
tableTypeService.updateTableType = async (
  id,
  nameType,
  minSeat,
  maxSeat,
  storeId
) => {
  await db
    .update(tableTypes)
    .set({
      nameType,
      minSeat,
      maxSeat,
      storeId,
    })
    .where(eq(tableTypes.id, id));

  // คืนข้อมูลใหม่เลย เพราะ drizzle ไม่ได้ return object
  return {
    id,
    nameType,
    minSeat,
    maxSeat,
    storeId,
  };
};

// --- DELETE ---
tableTypeService.deleteTableType = async (id) => {
  await db.delete(tableTypes).where(eq(tableTypes.id, id));

  // ปกติ delete จะไม่ return ข้อมูล
  return {
    tableType: { id },
  };
};

export { tableTypeService };
