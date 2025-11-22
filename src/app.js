import express from "express";
import cors from "cors";
import { authRouter } from "./router/auth.route";

const app = express();

app.use(express.json());
app.use(cors());

app.use("auth", authRouter);

app.listen(3000, () => console.log("SERVER IS STARTING AT PORT 3000"));
