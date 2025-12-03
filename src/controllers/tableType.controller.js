import { tableTypeService } from '../services/tableType.service.js';

const tableTypeController = {};

tableTypeController.getAllTableTypes = async (req, res, next) => {
  try {
    const { tableTypes } = await tableTypeService.getAllTableTypes();
    res.status(200).json({
      message: 'get all table types successful',
      tableTypes,
    });
  } catch (error) {
    next(error);
  }
};

tableTypeController.getTableTypeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: 'Invalid ID format' });

    const { tableType } = await tableTypeService.getTableTypeById(id);

    if (!tableType) {
      return res.status(404).json({ message: `Table type ${id} not found` });
    }

    res.status(200).json({
      message: 'get table type by id successful',
      tableType,
    });
  } catch (error) {
    next(error);
  }
};

tableTypeController.createTableType = async (req, res, next) => {
  try {
    const { nameType, minSeat, maxSeat, storeId } = req.body;

    const { tableType } = await tableTypeService.createTableType(
      nameType,
      minSeat,
      maxSeat,
      storeId
    );

    res.status(201).json({
      message: 'create table type successful',
      tableType,
    });
  } catch (error) {
    next(error);
  }
};

tableTypeController.updateTableType = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: 'Invalid ID format' });

    const { nameType, minSeat, maxSeat, storeId } = req.body;

    const tableType = await tableTypeService.updateTableType(
      id,
      nameType,
      minSeat,
      maxSeat,
      storeId
    );

    if (!tableType)
      return res.status(404).json({ message: `Table type ${id} not found` });

    res.status(200).json({
      message: 'update table type successful',
      tableType,
    });
  } catch (error) {
    next(error);
  }
};

tableTypeController.deleteTableType = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: 'Invalid ID format' });

    const { tableType } = await tableTypeService.deleteTableType(id);

    res.status(200).json({
      message: 'delete table type successful',
      tableType,
    });
  } catch (error) {
    next(error);
  }
};

export { tableTypeController };
