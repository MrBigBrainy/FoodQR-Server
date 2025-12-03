import { Router } from "express"
import { validateDiscount } from "../controller/discount.controller.js";

export const discountRouter = Router();

discountRouter.post("/validate", validateDiscount)
discountRouter.post("/login", (req, res) => { res.send('login') })


