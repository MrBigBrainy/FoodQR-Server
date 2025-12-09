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
} from "../controller/store.controller.js";
import { createMenu } from "../controller/menu.controller.js";

const storeRouter = Router();
storeRouter.get("/", (req, res) => res.send("TEST OK"));
storeRouter.get("/:storeId/menu", getStoreMenuController);
storeRouter.get("/:storeId/category", getStoreCategoryController);
storeRouter.post("/menu", createMenu);

export default storeRouter;
