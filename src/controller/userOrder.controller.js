import { addToOrder } from "../service/userOrder.service.js";

export async function createUserOrder(req, res) {
  const { menuId, quantity, orderId, note, lineId } = req.body;

  if (!menuId || !quantity || !orderId || !lineId) {
    return res.status(400).json({
      message: "Invalid order",
    });
  }
  try {
    const orderItem = {
      menuId,
      quantity,
      orderId: orderId || null,
      note: note || "",
    };
    const updatedOrder = await addToOrder(orderItem);

    return res.status(201).json({
      message: "Create order",
      data: updatedOrder,
    });
  } catch (err) {
    console.error("Error Creating order", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
