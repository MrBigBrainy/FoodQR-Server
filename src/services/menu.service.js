import { db } from "../../drizzle/db.js";
import { menu } from "../../drizzle/schema.js";

export const insertMenus = async (data) => {
    try {
        const {
            name,
            detail,
            price,
            discount,
            netPrice,
            categoryId,
            storeId,
            menuTypeId,
            imageUrl,
        } = data;

        // ✅ ตรวจสอบข้อมูลก่อน insert
        if (!name || !price || !categoryId || !netPrice || !categoryId || !storeId) {
            throw new Error("กรุณากรอกข้อมูลให้ครบ");
        }

        // ✅ ใช้ drizzle insert
        const result = await db.insert(menu).values({
            name,
            detail,
            price,
            discount,
            netPrice,
            categoryId,
            storeId,
            menuTypeId,
            imageUrl,
        });

        console.log("✅ เพิ่มเมนูสำเร็จ:", result);
        return result;
    } catch (err) {
        console.error("❌ insertMenus error:", err);
        throw err;
    }
}