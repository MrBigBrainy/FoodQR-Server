import { createOrderService } from "../service/order.service.js";

export async function createOrder(req, res) {
  const data = req.body;
  console.log("data", data)

  if (!data) {
    return res.status(400).json({
      message: "Invalid order",
    });
  }
  try {
      const orderId = await createOrderService(data);
      console.log("orderId",orderId)

    return res.status(201).json({
      message: "Create order",
      orderId,
    });
    
  } catch (err) {
    console.error("Error Creating order", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
