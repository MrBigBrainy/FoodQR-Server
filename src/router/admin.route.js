import { Router } from "express";

export const adminRouter = Router();

adminRouter.post("/register", (req, res) => { res.send('register') })
adminRouter.post("/login", (req, res) => { res.send('login') })

