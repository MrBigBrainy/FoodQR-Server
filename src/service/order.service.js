import { db } from "../../drizzle/db.js";
import { orders } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export async function createOrderService({tableId, storeId, customerCount}) {
    try {
        const result = await db.insert(orders).values({
            tableId,
            storeId,
            customerCount,
        });
        const orderId = result[0].insertId;
        return orderId;
    } catch (error) {
        console.log(error)
    }   
}