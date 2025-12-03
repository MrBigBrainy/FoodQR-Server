import express from 'express';
import { tableTypeController } from '../controllers/tableType.controller.js';

const tableTypeRouter = express.Router();

tableTypeRouter.get('/', tableTypeController.getAllTableTypes);
tableTypeRouter.get('/:id', tableTypeController.getTableTypeById);
tableTypeRouter.post('/', tableTypeController.createTableType);
tableTypeRouter.patch('/:id', tableTypeController.updateTableType);
tableTypeRouter.delete('/:id', tableTypeController.deleteTableType);

export { tableTypeRouter };
