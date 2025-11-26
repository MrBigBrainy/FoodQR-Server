import { db } from "../../drizzle/db.js";
import { menu } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export async function getMenuByStoreId(storeId) {
    const items = await db
        .select({
            id: menu.id,
            name: menu.name,
            detail: menu.detail,
            price: menu.price,
            imageUrl: menu.imageUrl
            // category: menu.category,
        })
        .from(menu)
        .where(eq(menu.storeId, storeId));

    return items;
}
