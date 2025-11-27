import { tableTypeService } from '../services/tableType.service.js';

const tableTypeController = {};

tableTypeController.getAllTableTypes = async (req, res, next) => {
  const { tableTypes } = await tableTypeService.getAllTableTypes();
  res.status(200).json({ message: 'get all table types', tableTypes });
};

tableTypeController.createTableType = async (req, res, next) => {
  const { nameType, minSeat, maxSeat, storeId } = req.body;
  const { tableType } = await tableTypeService.createTableType(
    nameType,
    minSeat,
    maxSeat,
    storeId
  );
  res.status(201).json({ message: 'create table type', tableType });
};
tableTypeController.updateTableType = async (req, res, next) => {
  const idParams = req.params.id;
  const id = Number(idParams);
  const { nameType, minSeat, maxSeat, storeId } = req.body;
  const tableType = await tableTypeService.updateTableType(
    id,
    nameType,
    minSeat,
    maxSeat,
    storeId
  );
  //   console.log(tableType);
  res.status(200).json({ message: 'update table type', tableType });
};
tableTypeController.deleteTableType = async (req, res, next) => {
  const idParams = req.params.id;
  const id = Number(idParams);
  const { tableType } = await tableTypeService.deleteTableType(id);
  res.status(200).json({ message: 'delete table type', tableType });
};

export { tableTypeController };
