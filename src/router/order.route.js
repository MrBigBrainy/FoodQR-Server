import { Router } from "express";
import { createOrder, updateOrder } from "../controller/order.controller.js";

const orderRouter = Router();
orderRouter.post("/", createOrder);
orderRouter.patch("/:orderId", updateOrder);

export default orderRouter;