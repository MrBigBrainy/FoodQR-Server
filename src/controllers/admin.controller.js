import { db } from "../../drizzle/db.js";
import { orders } from "../../drizzle/schema.js";

// เรียกข้อมูล
export const salesToday = async (req, res) => {
    const result = await db.select({
        // order ชื่อ table.colum ที่ใช้
        total: orders.total
    }).from(orders);
    res.status(201).json(result);
    // res.send("test")
}
// เพิ่ม order เข้า db
export const createOrder = async (req, res) => {
    try {
        const { tableId, orderUserId, subtotal, total, discountId, status, billId } = req.body;
        console.log(req.body); // 👈 ใส่ไว้เช็กว่าค่ามาจริงไหม
        await db.insert(orders).values({
            tableId: Number(tableId),
            orderUserId: Number(orderUserId),
            subtotal: Number(subtotal),
            total: Number(total),
            discountId: Number(discountId),
            status,
            billId: Number(billId),
            openTime: new Date()
        });
        res.status(201).json({ message: "เพิ่มออเดอร์สำเร็จ!" });
    } catch (error) {
        console.error("createOrder error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
    }
};