import { Router } from 'express';
import {
  getStoreMenuController,
  getStoreCategoryController,
  storeController,
} from '../controller/store.controller.js';

const storeRouter = Router();
storeRouter.get('/:storeId', storeController.getStoreById);
storeRouter.post('/', storeController.createStore);
storeRouter.put('/:storeId', storeController.updatedStore);
storeRouter.delete('/:storeId', storeController.deleteStore);

storeRouter.get('/:storeId/menu', getStoreMenuController);
storeRouter.get('/:storeId/category', getStoreCategoryController);

export default storeRouter;
