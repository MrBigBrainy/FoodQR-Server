import {
  deleteMenus,
  insertMenus,
  updateMenus,
} from "../services/menu.service.js";

export const createMenu = async (req, res) => {
  const storeId = req.user?.storeId || req.body.storeId;

  if (!storeId) {
    return res
      .status(403)
      .json({ message: "Authentication is required to perform this action." });
  }
  try {
    const result = await insertMenus(req.body);
    res.status(201).json({ message: " เพิ่มเมนูสำเร็จ!" });
  } catch (err) {
    console.error(" createMenu error:", err);
    res.status(500).json({ message: "เกิดข้อผิดดพลาดในการเพิ่มข้อมูล" });
  }
};

export const updateMenu = async (req, res) => {
  const { id } = req.params;
  const storeId = req.user?.storeId || req.body.storeId;

  if (!storeId) {
    return res
      .status(403)
      .json({ message: "Authentication is required to perform this action." });
  }
  if (!id) {
    return res.status(400).json({ message: "Coupon ID is required" });
  }
  const menuUpdateData = {
    ...req.body,
    storeId: Number(storeId),
  };
  try {
    const result = await updateMenus(id, storeId, menuUpdateData);
    if (result.updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "ไม่พบเมนู หรือไม่มีสิทธิ์แก้ไขเมนูนี้" });
    }

    return res.status(200).json({
      message: " อัปเดตเมนูสำเร็จ!",
      data: result,
    });
  } catch (err) {
    if (err.message && err.message.includes("กรุณากรอกข้อมูล")) {
      return res.status(400).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดดพลาดในการอัพเดทข้อมูล" });
  }
};

export const deleteMenu = async (req, res) => {
  const { id } = req.params;
  const storeId = req.user?.storeId || req.body.storeId;

  if (!storeId) {
    return res.status(403).json({ message: "storeId is required " });
  }
  if (!id) {
    return res.status(400).json({ message: "menu ID is required" });
  }
  try {
    const result = await deleteMenus(id, storeId);
    if (result.deletedRows === 0) {
      return res
        .status(404)
        .json({ message: "ไม่พบเมนู หรือไม่มีสิทธิ์ลบเมนูนี้" });
    }
    res.status(200).json({ message: "ลบเมนูสำเร็จ!", date: result });
  } catch (err) {
    console.error("UpdateMenu error:", err);
    res.status(500).json({ message: "เกิดข้อผิดดพลาดในการอัพเดทข้อมูล" });
  }
};
