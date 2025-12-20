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

export async function updateOrderService(data, orderId) {
    try {
        const result = await db.update(orders).set(data).where(eq(orders.id, orderId));
        console.log('update order service result', result)
        return result;
    } catch (error) {
        console.log(error)
    }   
}