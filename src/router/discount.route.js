import { Router } from "express";
import {
  createDiscount,
  deleteDiscount,
  getDiscount,
  updateDiscount,
  validateDiscount,
} from "../controller/discount.controller.js";

export const discountRouter = Router();

discountRouter.post("/validate", validateDiscount);
discountRouter.post("/login", (req, res) => {
  res.send("login");
});
//mock auth
discountRouter.use((req, res, next) => {
  req.user = {
    id: 1,
    storeId: 1,
  };
  next();
});

discountRouter.post("/create", createDiscount); //รอใส่ auth
discountRouter.delete("/delete/:id", deleteDiscount); //รอใส่ auth
discountRouter.get("/get", getDiscount); //รอใส่ auth
discountRouter.put("/update/:id", updateDiscount); //รอใส่ auth
