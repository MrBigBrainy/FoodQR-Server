import { db } from "../../drizzle/db.js";
import { orders } from "../../drizzle/schema.js";

export async function createOrderService(tableId) {
    try {
        const order = await db.insert(orders).values({
            tableId,
        });
        return order;
    } catch (error) {
        console.log(error)
    }
}