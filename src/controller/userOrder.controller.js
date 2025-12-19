import { addToOrder, getUserOrderByOrderIdService} from "../service/userOrder.service.js";

export async function createUserOrder(req, res) {
  const { menuId, quantity, orderId, note, lineId } = req.body;
  console.log(req.body)

  // if (!menuId || !quantity || !orderId || !lineId) {
  //   return res.status(400).json({
  //     message: "Invalid order",
  //   });
  // }

   if (!menuId || !quantity || !orderId ) {
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


export async function getAllUserOrderByOrderId(req, res) {
  const { orderId } = req.params;

  try {
    const userOrder = await getUserOrderByOrderIdService(orderId);
    return res.status(200).json({
      message: "Get user order",
      data: userOrder,
    });
  } catch (err) {
    console.error("Error Getting user order", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}