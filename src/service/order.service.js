import { db } from "../../drizzle/db.js";
import { orders } from "../../drizzle/schema.js";

export async function createOrderService({tableId, storeId, customerCount}) {
    try {
        const order = await db.insert(orders).values({
            tableId,
            storeId,
            customerCount,
        });
        return order;
    } catch (error) {
        console.log(error)
    }
}