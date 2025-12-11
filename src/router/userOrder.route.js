import { Router } from "express";
import { createUserOrder, getAllUserOrderByOrderId } from "../controller/userOrder.controller.js";

export const userOrderRouter = Router();

userOrderRouter.post("/createOrder", createUserOrder);
userOrderRouter.get("/:orderId", getAllUserOrderByOrderId);