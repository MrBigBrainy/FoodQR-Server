import { insertMenus, updateMenus } from "../services/menu.service.js";

export const createMenu = async (req, res) => {
  const storeId = req.user?.storeId || req.body.storeId;

  if (!storeId) {
    return res
      .status(403)
      .json({ message: "Authentication is required to perform this action." });
  }
  try {
    const result = await insertMenus(req.body);
    res.status(201).json({ message: "✅ เพิ่มเมนูสำเร็จ!" });
  } catch (err) {
    console.error("❌ createMenu error:", err);
    res.status(500).json({ message: "เกิดข้อผิดดพลาดในการเพิ่มข้อมูล" });
  }
};

export const updateMenu = async (req, res) => {};
const storeId = req.user?.storeId || req.body.storeId;

if (!storeId) {
  return res
    .status(403)
    .json({ message: "Authentication is required to perform this action." });
}
try {
  const result = await updateMenu(req.body);
  res.status(201).json({ message: "✅ เพิ่มเมนูสำเร็จ!" });
} catch (err) {
  console.error("❌ createMenu error:", err);
  res.status(500).json({ message: "เกิดข้อผิดดพลาดในการเพิ่มข้อมูล" });
}

export const deleteMenu = async (req, res) => {};
