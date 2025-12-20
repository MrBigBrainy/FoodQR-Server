import { db } from "../../drizzle/db.js";
import { userOrders } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export async function addToOrder({ menuId, quantity, orderId, note, lineId, displayName, imageUrl }) {
  console.log("test");
  try {
    const [newItem] = await db.insert(userOrders).values({
      menuId,
      quantity,
      orderId,
      note,
      lineId,
      displayName,
      imageUrl
    });

    return newItem;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserOrderByTableId(tableId) {
  try {
    const userOrder = await db.query.userOrders.findMany({
      where: eq(userOrders.tableId, tableId),
    });
    return userOrder;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserOrderByOrderIdService(orderId) {
  try {
    const userOrder = await db.query.userOrders.findMany({
      where: eq(userOrders.orderId, orderId),
      with: {
    menu: true,
  }
    });
    return userOrder;
  } catch (error) {
    console.log(error);
  }
}