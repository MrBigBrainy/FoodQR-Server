import { Router } from "express";
import {
  getStoreMenuController,
  getStoreCategoryController,
  storeController,
} from "../controller/store.controller.js";
import {
  createMenu,
  deleteMenu,
  updateMenu,
} from "../controller/menu.controller.js";

const storeRouter = Router();
storeRouter.get("/:storeId", storeController.getStoreById);
storeRouter.post("/", storeController.createStore);
storeRouter.put("/:storeId", storeController.updatedStore);
storeRouter.delete("/:storeId", storeController.deleteStore);

storeRouter.get("/:storeId/menu", getStoreMenuController);
storeRouter.get("/:storeId/category", getStoreCategoryController);

///ที่ฟูลทำ
storeRouter.post("/createMenu", createMenu);
storeRouter.delete("/deleteMenu/:menuId", deleteMenu);
storeRouter.put("/updateMenu/:menuId", updateMenu);

//Mock authสำหรับยิง postman เท่านั้น
storeRouter.use((req, res, next) => {
  req.user = {
    id: 1,
    storeId: 1,
  };
  next();
});

export default storeRouter;
