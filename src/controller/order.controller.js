import { createOrderService } from "../service/order.service.js";

export async function createOrder(req, res) {
  const { tableId } = req.body;

  if (!tableId) {
    return res.status(400).json({
      message: "Invalid order",
    });
  }
  try {
      const order = await createOrderService(tableId);
      console.log(order)

    return res.status(201).json({
      message: "Create order",
      data: order,
    });
    
  } catch (err) {
    console.error("Error Creating order", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
