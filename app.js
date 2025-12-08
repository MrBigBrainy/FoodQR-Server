import express from 'express';
import cors from 'cors';
import { authRouter } from './src/router/auth.route.js';
import { adminRouter } from './src/router/admin.route.js';
import omiseFactory from 'omise';
import dotenv from 'dotenv';
import { tableTypeRouter } from './src/router/tableType.route.js';
import { tableRouter } from './src/router/table.route.js';
import errorMiddleware from './src/middlewares/error.middleware.js';
import storeRouter from './src/router/store.route.js';
import { discountRouter } from './src/router/discount.route.js';
import http from 'http';
import { Server } from 'socket.io';
import { userOrderRouter } from "./src/router/userOrder.route.js";
import socketHandler from './src/utils/socket/socketHandler.js';

import orderRouter from "./src/router/order.route.js";

dotenv.config();

const app = express();

io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("joinTable", ({ tableId }) => {
        const roomName = `table-${tableId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined ${roomName}`);
    });

    socket.on("leaveTable", ({ tableId }) => {
        const roomName = `table-${tableId}`;
        socket.leave(roomName);
        console.log(`Socket ${socket.id} left ${roomName}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

app.use(express.json());
app.use(cors());

// socket io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// กำหนดค่า io 
app.set("io", io);

//test
// ─────────── TABLE ───────────//
app.use("/api/admin/table-types", tableTypeRouter);
app.use("/api/admin/tables", tableRouter);

app.post("/api/omise", async (req, res) => {
    const omise = omiseFactory({
        secretKey: process.env.OMISE_SECRET_KEY,
        omiseVersion: "2019-05-29",
    });

    try {
        const sourceOmise = req.body.source;

        if (!sourceOmise) {
            return res.status(400).json({ error: "source is required" });
        }

        const createCharge = (source, amount, orderId) => {
            return new Promise((resolve, reject) => {
                omise.charges.create(
                    {
                        amount: amount * 100,
                        currency: "THB",
                        return_uri: "http://localhost:5173/",
                        metadata: { orderId },
                        source,
                    },
                    (err, resp) => {
                        if (err) return reject(err);
                        resolve(resp);
                    }
                );
            });
        };

        const omiseResponse = await createCharge(sourceOmise, 100, 1);

        const additionalDataToStoreInSchema = {
            payment_method: "promptpay",
            chargeId: omiseResponse.id,
        };
        console.log("omiseResponse", omiseResponse);

        return res.json({
            qrUrl: omiseResponse.source.scannable_code.image.download_uri,
            amount: omiseResponse.amount,
            status: omiseResponse.status,
            chargeId: omiseResponse.id,
        });
    } catch (err) {
        console.error("Omise charge error:", err);
        return res.status(500).json({
            message: "Omise charge failed",
            error: err?.message ?? err,
        });
    }
});
app.use("/api/store", storeRouter);
app.use("/api/userOrder", userOrderRouter);
app.use("/api/discount", discountRouter);
app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// รวมคำสั่ง socket
socketHandler(io);

app.use(errorMiddleware);

server.listen(3000, () => console.log("SERVER IS STARTING AT PORT 3000"));
