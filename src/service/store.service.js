import { db } from '../../drizzle/db.js';
import { menu, category, stores } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export async function getMenuByStoreId(storeId) {
  try {
    const menuData = await db.query.menu.findMany({
      where: eq(menu.storeId, storeId),
      with: {
        category: true,
      },
    });
    // const menuData = await db.query.menu.findMany();
    console.log('menuData', menuData);
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

const storeService = {};
// --- get by id ---
storeService.getStoreById = async (id) => {
  const result = await db.select().from(stores).where(eq(stores.id, id));

  return {
    store: result[0] || null,
  };
};

//--- create store ---//
storeService.createStore = async (data) => {
  const result = await db.insert(stores).values(data);

  return {
    store: {
      id: result.insertId,
      ...data,
    },
  };
};
// --- update by id ---
storeService.updateStoreById = async (id, data) => {
  console.log(data)
  await db.update(stores).set(data).where(eq(stores.id, id));

  const updated = await db.select().from(stores).where(eq(stores.id, id));

  return {
    store: updated[0] || null,
  };
};

// --- delete store by id ---
storeService.deleteStoreById = async (id) => {
  // ดึงมาก่อนเพื่อเช็คว่ามีจริงไหม
  const existing = await db.select().from(stores).where(eq(stores.id, id));

  if (!existing[0]) {
    return { store: null };
  }

  // ลบข้อมูล
  await db.delete(stores).where(eq(stores.id, id));

  // ส่งค่าที่ถูกลบกลับไป
  return { store: existing[0] };
};
export { storeService };
