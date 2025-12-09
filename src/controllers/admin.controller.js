import { between } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { orders } from "../../drizzle/schema.js";

// เรียกข้อมูลรายวัน
export const salesToday = async (req, res) => {
    try {
        // วันนี้
        const today = new Date();
        today.setHours(0, 0, 0, 0); // เริ่มที่ 00:00:00
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // สิ้นสุด 23:59:59
        // รับข้อมูล
        const io = req.app.get("io");
        const result = await db.select(
        )
            .from(orders)
            .where(between(orders.openTime, today, tomorrow));
        const saleToday = result.reduce((sum, order) => sum + (order.total || 0), 0);
        const sumOrder = result.length
        const sumCustomer = result.reduce((sum, order) => sum + (order.customerCount || 0), 0)

        // ส่งข้อมูลไป หาsocket
        io.emit("updateSale", { saleToday, sumOrder, sumCustomer });
        res.status(201).json(result);
        // res.send("test")
    } catch (error) {
        console.error("createOrder error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึง" });
    }
}

// เพิ่ม order เข้า db
export const createOrder = async (req, res) => {
    try {
        const { tableId, subtotal, total, discountId, billId, userOrderId, storeId, customerCount } = req.body;
        console.log(req.body);
        // วันนี้
        const today = new Date();
        today.setHours(0, 0, 0, 0); // เริ่มที่ 00.00
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        // เพิ่มข้อมูลเข้า
        await db.insert(orders).values({
            tableId: Number(tableId),
            subtotal: Number(subtotal),
            total: Number(total),
            discountId: Number(discountId),
            userOrderId: Number(userOrderId),
            billId: Number(billId),
            storeId: Number(storeId),
            openTime: new Date(),
            customerCount: Number(customerCount),
        });
        // socket
        const io = req.app.get("io");
        const result = await db.select(
        )
            .from(orders)
            .where(between(orders.openTime, today, tomorrow));
        const saleToday = result.reduce((sum, order) => sum + (order.total || 0), 0);
        const sumOrder = result.length
        const sumCustomer = result.reduce((sum, order) => sum + (order.customerCount || 0), 0)

        // ส่งข้อมูลไป หาsocket
        io.emit("updateSale", { saleToday, sumOrder, sumCustomer });
        res.status(201).json({ message: "เพิ่มออเดอร์สำเร็จ!" });
    } catch (error) {
        console.error("createOrder error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
    }
};