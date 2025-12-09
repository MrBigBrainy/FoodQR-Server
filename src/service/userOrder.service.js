import { db } from "../../drizzle/db.js";
import { userOrders } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export async function addToOrder({ menuId, quantity, orderId, note, lineId }) {
  console.log("test");
  try {
    const [newItem] = await db.insert(userOrders).values({
      menuId,
      quantity,
      orderId,
      note,
      lineId,
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