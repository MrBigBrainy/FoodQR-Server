import { Router } from "express";
import {
  createDiscount,
  validateDiscount,
} from "../controller/discount.controller.js";

export const discountRouter = Router();

discountRouter.post("/validate", validateDiscount);
discountRouter.post("/login", (req, res) => {
  res.send("login");
});

discountRouter.post("/createDiscount", createDiscount);
