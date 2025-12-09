import { and, eq } from "drizzle-orm";
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

    if (!name || !price || !netPrice || !categoryId || !storeId) {
      throw new Error("กรุณากรอกข้อมูลให้ครบ");
    }

    const result = await db.insert(menu).values({
      name,
      detail,
      price: Number(price),
      discount: Number(discount) || 0,
      netPrice: Number(netPrice),
      categoryId: Number(categoryId),
      storeId: Number(storeId),
      menuTypeId: Number(menuTypeId),
      imageUrl,
    });

    console.log("✅ เพิ่มเมนูสำเร็จ:", result);
    return result;
  } catch (err) {
    if (err.cause && err.cause.code === "ER_DUP_ENTRY") {
      throw new Error("ชื่อเมนูนี้ถูกใช้งานในร้านค้าของคุณแล้ว");
    }

    console.error("insertMenus error:", err);
    throw err;
  }
};
export const updateMenus = async (menuId, storeId, updateData) => {
  if (!menuId || !storeId || !updateData) {
    throw new Error("Missing require data for update");
  }
  try {
    const {
      name,
      detail,
      price,
      discount,
      netPrice,
      categoryId,
      menuTypeId,
      imageUrl,
    } = updateData;
    const updatePayload = {
      name: name,
      detail: detail,
      imageUrl: imageUrl,
      price: price !== undefined ? Number(price) : undefined,
      discount: discount !== undefined ? Number(discount) : undefined,
      netPrice: netPrice !== undefined ? Number(netPrice) : undefined,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      menuTypeId: menuTypeId !== undefined ? Number(menuTypeId) : undefined,
    };
    const result = await db
      .update(menu)
      .set(updatePayload)
      .where(
        and(
          eq(menu.id, Number(menuId)),
          eq(menu.storeId, Number(storeId)) // 🛡️ Security Check
        )
      );

    return { updateRows: result };
  } catch (err) {
    if (err.cause && err.cause.code === "ER_DUP_ENTRY") {
      throw new Error("ชื่อเมนูนี้ถูกใช้งานในร้านค้าของคุณแล้ว");
    }
    throw err;
  }
};

export const deleteMenus = async (menuId, storeId) => {
  if (!menuId || !storeId) {
    throw new Error("Missing Menu ID or Store ID.");
  }
  try {
    const result = await db
      .delete(menu)
      .where(
        and(eq(menu.id, Number(menuId)), eq(menu.storeId, Number(storeId)))
      );

    return { deletedRows: result.rowsAffected };
  } catch (err) {
    throw err;
  }
};
