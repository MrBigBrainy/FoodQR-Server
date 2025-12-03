import { db } from "../../drizzle/db.js";
import { menu, category } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export async function getMenuByStoreId(storeId) {
  try {
    const menuData = await db.query.menu.findMany({
      where: eq(menu.storeId, storeId),
      with: {
        category: true,
      },
    });
    return menuData;
  } catch (error) {
    console.log(error);
  }
}

export async function getCategoryByStoreId(storeId) {
  const categoryData = await db.query.category.findMany({
    where: eq(category.storeId, storeId),
  });
  return categoryData;
}
