import { Router } from "express";
import { getStoreMenuController } from "../controller/store.controller.js";

const storeRouter = Router();

// storeRouter.get("/", (req, res) => res.send({ message: "OK" }))
storeRouter.get("/:storeId/menu", getStoreMenuController);

export default storeRouter;
