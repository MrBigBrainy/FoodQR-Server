import { Router } from "express";
import { createOrder } from "../controller/order.controller.js";

const orderRouter = Router();
orderRouter.post("/", createOrder);

export default orderRouter;