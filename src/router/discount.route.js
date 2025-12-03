import { Router } from "express"

export const discountRouter = Router();

discountRouter.get("/validate", (req, res) => { res.send('validate') })
discountRouter.post("/login", (req, res) => { res.send('login') })


