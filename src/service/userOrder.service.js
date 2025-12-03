import { db } from "../../drizzle/db.js";
import { orderUsers } from "../../drizzle/schema.js";

export async function addToOrder({ menuId, quantity, orderId, note, lineId }) {
  console.log("test");
  try {
    const [newItem] = await db.insert(orderUsers).values({
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
