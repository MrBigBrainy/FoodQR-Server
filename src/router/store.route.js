import { Router } from "express";
import {
  getStoreMenuController,
  getStoreCategoryController,
  storeController,
} from "../controller/store.controller.js";
import {
  createMenu,
  deleteMenu,
  getMenu,
  updateMenu,
} from "../controller/menu.controller.js";
import upload from "../config/upload.config.js";

const storeRouter = Router();
storeRouter.get("/:storeId", storeController.getStoreById);
storeRouter.post("/", storeController.createStore);
storeRouter.put("/:storeId", storeController.updatedStore);
storeRouter.delete("/:storeId", storeController.deleteStore);

storeRouter.get("/:storeId/menu", getStoreMenuController);
storeRouter.get("/:storeId/category", getStoreCategoryController);

///ที่ฟูลทำ
//Mock authสำหรับยิง postman เท่านั้น
storeRouter.use((req, res, next) => {
  req.user = {
    id: 1,
    storeId: 1,
  };
  next();
});

storeRouter.get("/menu", getMenu);
storeRouter.post("/menu", upload.single("imageFile"), createMenu);
storeRouter.delete("/menu/:id", deleteMenu);
storeRouter.put("/menu/:id", updateMenu);

export default storeRouter;
