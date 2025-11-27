import { Router } from "express";
import { getStoreMenuController, getStoreCategoryController } from "../controller/store.controller.js";

const storeRouter = Router();

storeRouter.get("/:storeId/menu", getStoreMenuController);
storeRouter.get("/:storeId/category", getStoreCategoryController);

export default storeRouter;
