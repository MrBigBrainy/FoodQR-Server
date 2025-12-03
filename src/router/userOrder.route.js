import { Router } from "express";
import { createUserOrder } from "../controller/userOrder.controller.js";

export const userOrderRouter = Router();

userOrderRouter.post("/createOrder", createUserOrder);
