import express from 'express';
import { tableController } from '../controllers/table.controller.js';
const tableRouter = express.Router();

tableRouter.get('/', tableController.getAllTables);
tableRouter.get('/:id', tableController.getTableById);
tableRouter.post('/', tableController.createTable);
tableRouter.patch('/status', tableController.updateTableStatus);
tableRouter.patch('/:id', tableController.updateTable);
tableRouter.delete('/:id', tableController.deleteTable);

export { tableRouter };
