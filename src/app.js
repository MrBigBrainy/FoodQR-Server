import express from "express";
import cors from "cors";
import { authRouter } from "./router/auth.route.js";
import { adminRouter } from "./router/admin.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/admin", adminRouter)

app.listen(3000, () => console.log("SERVER IS STARTING AT PORT 3000"));
