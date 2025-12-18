// import { tableService } from '../services/table.service.js';

// const tableController = {};

// tableController.getAllTables = async (req, res, next) => {
//   const { tables } = await tableService.getAllTables();
//   res.status(200).json({ message: 'get all tables', tables });
// };
// tableController.getTableById = async (req, res, next) => {
//   const idParams = req.params.id;
//   const id = Number(idParams);
//   const { table } = await tableService.getTableById(id);
//   res.status(200).json({ message: 'get table by id', table });
// };

// tableController.createTable = async (req, res, next) => {
//   const { tableName, zoneId, tableTypeId, storeId } = req.body;
//   console.log(req.body);
//   const { table } = await tableService.createTable(
//     tableName,
//     zoneId,
//     tableTypeId,
//     storeId
//   );
//   res.status(201).json({ message: 'create table', table });
// };

// tableController.updateTable = async (req, res, next) => {
//   const idParams = req.params.id;
//   const id = Number(idParams);
//   const { tableName, zoneId, tableTypeId, storeId } = req.body;
//   const { table } = await tableService.updateTable(
//     id,
//     tableName,
//     zoneId,
//     tableTypeId,
//     storeId
//   );
//   res.status(200).json({ message: 'update table', table });
// };
// tableController.deleteTable = async (req, res, next) => {
//   const idParams = req.params.id;
//   const id = Number(idParams);
//   const { table } = await tableService.deleteTable(id);
//   res.status(200).json({ message: 'delete table', table });
// };

// export { tableController };

import { tableService } from '../services/table.service.js';

const tableController = {};

// GET ALL TABLES
tableController.getAllTables = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const { tables } = await tableService.getAllTables();
    console.log('tables', tables)

    const sumTable = tables.length
    const availableTable = tables.filter((each) => each.status === "available").length;


    console.log('sumTable', sumTable)
    console.log('availableTable', availableTable)
    io.emit("updateTable", { sumTable, availableTable });

    res.status(200).json(
      tables
    );
  } catch (error) {
    next(error);
  }
};

// GET TABLE BY ID
tableController.getTableById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const { table } = await tableService.getTableById(id);

    if (!table)
      return res.status(404).json({ message: `Table ${id} not found` });

    res.status(200).json({
      message: 'get table by id successful',
      table,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE TABLE
tableController.createTable = async (req, res, next) => {
  try {
    const { tableName, zoneId, tableTypeId, storeId } = req.body;

    const { table } = await tableService.createTable(
      tableName,
      zoneId,
      tableTypeId,
      storeId
    );

    res.status(201).json({
      message: 'create table successful',
      table,
    });
  } catch (error) {
    next(error);
  }
};
// UPDATE TABLE
tableController.updateTable = async (req, res, next) => {
  const id = Number(req.params.id);
  const { tableName, zoneId, tableTypeId, storeId } = req.body;

  const { table } = await tableService.updateTable(
    id,
    tableName,
    zoneId,
    tableTypeId,
    storeId
  );

  res.status(200).json({
    message: 'update table',
    table,
  });
};

// UPDATE TABLE STATUS
tableController.updateTableStatus = async (req, res, next) => {
  const { status, tableId, storeId } = req.body;

  const table = await tableService.updateTableStatus(tableId, status, storeId);
  const io = req.app.get('io');
  io.to(`store-${storeId}`).emit("tableStatusUpdated", table);

  res.status(200).json({
    success: true,
    table,
  });
};

// DELETE TABLE
tableController.deleteTable = async (req, res, next) => {
  const id = Number(req.params.id);

  const { table } = await tableService.deleteTable(id);

  res.status(200).json({
    message: 'delete table',
    table,
  });
};

export { tableController };
