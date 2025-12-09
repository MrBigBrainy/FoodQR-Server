import { insertMenus } from "../services/menu.service.js";

export const createMenu = async (req, res) => {
    try {
        const result = await insertMenus(req.body)
        res.status(201).json({ message: "✅ เพิ่มเมนูสำเร็จ!" });
    } catch (err) {
        console.error("❌ createMenu error:", err);
        res.status(500).json({ message: "เกิดข้อผิดดพลาดในการเพิ่มข้อมูล" });
    }
}