import { Router } from "express"

export const authRouter = Router();

authRouter.post("/register", (req, res) => { res.send('register') })
authRouter.post("/login", (req, res) => { res.send('login') })


