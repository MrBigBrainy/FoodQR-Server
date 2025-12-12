import {
  deleteMenus,
  getMenuById,
  insertMenus,
  updateMenus,
} from "../services/menu.service.js";

export const createMenu = async (req, res) => {
  console.log("📂 req.file =", req.file);
  console.log("📨 req.body =", req.body);

  const storeId = req.user?.storeId || req.body.storeId;
  const file = req.file;

  if (!storeId) {
    return res
      .status(403)
      .json({ message: "Authentication is required to perform this action." });
  }
  const menuData = {
    ...req.body,
    storeId: Number(storeId),
    price: Number(req.body.price),
    discount: Number(req.body.discount),
    netPrice: Number(req.body.netPrice),
    categoryId: Number(req.body.categoryId),
    menuTypeId: Number(req.body.menuTypeId), // หรือต้องจัดการกรณีที่เป็น NaN
  };
  if (file) {
    console.log("fileหกดหดกหด", file);
    const imageUrl = `https://your-cloud.com/images/${file.originalname}`;
    menuData.imageUrl = imageUrl;
  }
  try {
    const result = await insertMenus(menuData);
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
    console.error(err);
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

export const getMenu = async (req, res) => {
  res.send("----");
  // const storeId = req.user?.storeId || req.body.storeId;
  // if (!storeId) {
  //   return res.status(403).json({ message: "StoreI is required" });
  // }
  // try {
  //   const result = await getMenuById(storeId);
  //   if (!menus || menus.length === 0) {
  //     return res
  //       .status(200)
  //       .json({ message: "ไม่พบเมนูในร้านค้านี้", data: [] });
  //   }
  //   return res.status(200).json({
  //     message: "ดึงเมนูสำเร็จ",
  //     data: result,
  //   });
  // } catch (err) {
  //   console.err("getMenu error");
  // }
};
