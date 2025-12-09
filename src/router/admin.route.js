import { Router } from "express";
import { createOrder, salesToday } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.post("/register", (req, res) => { res.send('register') })
adminRouter.post("/login", (req, res) => { res.send('login') })
adminRouter.post("/order", createOrder)
adminRouter.get("/salesToday", salesToday)
test
// adminRouter.get("/orderToday", orderToday)

