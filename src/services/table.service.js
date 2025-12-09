// import prisma from '../config/prisma.config.js';

// const tableService = {};

// tableService.getAllTables = async () => {
//   const tables = await prisma.table.findMany();
//   return { tables };
// };
// tableService.getTableById = async (id) => {
//   const table = await prisma.table.findUnique({
//     where: { id },
//   });
//   return { table };
// };
// tableService.createTable = async (tableName, zoneId, tableTypeId, storeId) => {
//   console.log('storeId', storeId);
//   const table = await prisma.table.create({
//     data: {
//       tableName,
//       store: {
//         connect: { id: storeId },
//       },
//       tableType: {
//         connect: { id: tableTypeId },
//       },
//       ...(zoneId && { zone: { connect: { id: zoneId } } }),
//     },
//   });
//   return { table };
// };
// tableService.updateTable = async (id, tableName, zoneId, tableTypeId) => {
//   const table = await prisma.table.update({
//     where: { id },
//     data: {
//       tableName,
//       zoneId,
//       tableTypeId,
//       ...(zoneId && { zone: { connect: { id: zoneId } } }),
//     },
//   });
//   return { table };
// };
// tableService.deleteTable = async (id) => {
//   const table = await prisma.table.delete({
//     where: { id },
//   });
//   return { table };
// };

// export { tableService };

import { db } from '../../drizzle/db.js';
import { tables, tableTypes, zones, stores } from '../../drizzle/schema.js';
import { and, eq } from 'drizzle-orm';

const tableService = {};

tableService.getAllTables = async () => {
  const result = await db
    .select({
      id: tables.id,
      tableName: tables.tableName,
      status: tables.status,

      tableTypeId: tables.tableTypeId,
      tableType_name: tableTypes.nameType, // ✔ ชื่อ field จริง

      zoneId: tables.zoneId,
      zone_name: zones.zoneName, // ✔ ถูกแล้ว

      storeId: tables.storeId,
      store_name: stores.name, // ✔ ชื่อจริง: name
    })
    .from(tables)
    .leftJoin(tableTypes, eq(tables.tableTypeId, tableTypes.id))
    .leftJoin(zones, eq(tables.zoneId, zones.id))
    .leftJoin(stores, eq(tables.storeId, stores.id));

  const formatted = result.map((r) => ({
    id: r.id,
    tableName: r.tableName,
    status: r.status,
    tableType: r.tableTypeId
      ? { id: r.tableTypeId, nameType: r.tableType_name }
      : null,
    zone: r.zoneId ? { id: r.zoneId, zoneName: r.zone_name } : null,
    store: r.storeId ? { id: r.storeId, name: r.store_name } : null,
  }));

  return { tables: formatted };
};

// --- GET TABLE BY ID ---
tableService.getTableById = async (id) => {
  const result = await db
    .select({
      id: tables.id,
      tableName: tables.tableName,
      status: tables.status,

      tableTypeId: tables.tableTypeId,
      tableType_name: tableTypes.nameType, // ✔ ใช้ nameType ตาม schema

      zoneId: tables.zoneId,
      zone_name: zones.zoneName, // ✔ ถูกอยู่แล้ว

      storeId: tables.storeId,
      store_name: stores.name, // ✔ ชื่อ field จริง: name
    })
    .from(tables)
    .leftJoin(tableTypes, eq(tables.tableTypeId, tableTypes.id))
    .leftJoin(zones, eq(tables.zoneId, zones.id))
    .leftJoin(stores, eq(tables.storeId, stores.id))
    .where(eq(tables.id, id));

  if (!result || result.length === 0) return { table: null };

  const r = result[0];

  const formatted = {
    id: r.id,
    tableName: r.tableName,
    status: r.status,

    tableType:
      r.tableTypeId && r.tableType_name
        ? { id: r.tableTypeId, nameType: r.tableType_name }
        : null,

    zone:
      r.zoneId && r.zone_name ? { id: r.zoneId, zoneName: r.zone_name } : null,

    store:
      r.storeId && r.store_name ? { id: r.storeId, name: r.store_name } : null,
  };

  return { table: formatted };
};

// --- CREATE TABLE ---
tableService.createTable = async (tableName, zoneId, tableTypeId, storeId) => {
  const result = await db.insert(tables).values({
    tableName,
    zoneId: zoneId || null,
    tableTypeId,
    storeId,
  });

  return {
    table: {
      id: result.insertId,
      tableName,
      zoneId: zoneId || null,
      tableTypeId,
      storeId,
    },
  };
};

// --- UPDATE TABLE ---
tableService.updateTable = async (
  id,
  tableName,
  zoneId,
  tableTypeId,
  storeId
) => {
  await db
    .update(tables)
    .set({
      tableName,
      zoneId: zoneId || null,
      tableTypeId,
      storeId,
    })
    .where(eq(tables.id, id));

  return {
    table: {
      id,
      tableName,
      zoneId: zoneId || null,
      tableTypeId,
      storeId,
    },
  };
};

// --- UPDATE TABLE STATUS ---
tableService.updateTableStatus = async (tableId, status, storeId) => {
  await db
    .update(tables)
    .set({
      status,
      storeId,
    })
    .where(
      and(
        eq(tables.id, tableId),
        eq(tables.storeId, storeId)
      )
    );

  return {
    tableId,
    status,
    storeId,
  };
};

// --- DELETE TABLE ---
tableService.deleteTable = async (id) => {
  await db.delete(tables).where(eq(tables.id, id));

  return {
    table: { id },
  };
};

export { tableService };
