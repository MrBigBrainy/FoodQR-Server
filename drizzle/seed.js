// scripts/seedMenu.ts
import { categories, menu, menuTypes } from "./schema.js";
import { sql } from "drizzle-orm";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv"

dotenv.config()

// Create MySQL pool using DATABASE_URL (Railway)
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
});

// Create Drizzle DB client
const db = drizzle(pool, { schema: { categories, menu, menuTypes }, mode: "default" });

const DEFAULT_STORE_ID = 1;

// 1) Category seed (fixed ids so we can map easily)
const CATEGORY_SEED = [
    { id: 1, name: "ซูชิ", detail: "ซูชิคำเดี่ยว" },
    { id: 2, name: "ชุดเซทซูชิ", detail: "ชุดเซทซูชิ" },
    { id: 3, name: "ชุดปาร์ตี้", detail: "ชุดปาร์ตี้สำหรับหลายคน" },
    { id: 4, name: "ซาชิมิ", detail: "ซาชิมิ" },
    { id: 5, name: "เครื่องดื่ม", detail: "เมนูเครื่องดื่ม" },
];

const MENUTYPE_SEED = [
    { id: 1, name: "อาหาร", storeId: DEFAULT_STORE_ID },
    { id: 2, name: "เครื่องดื่ม", storeId: DEFAULT_STORE_ID },
];

// 2) Menu seed (from your sheet)
const MENU_SEED = [
    {
        menuId: "A01",
        name: "สเปเชียลมากิโรล",
        price: 220,
        discount: 10,
        netPrice: 210,
        categoryName: "ซูชิ",
        imageUrl:
            "https://images.unsplash.com/photo-1712725214706-e564b8dd1bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJvbGwlMjBtYWtpfGVufDF8fHx8MTc2Mzk5NjgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        menuId: "A02",
        name: "ซูชิโรล",
        price: 40,
        discount: 0,
        netPrice: 40,
        categoryName: "ซูชิ",
        imageUrl:
            "https://media.istockphoto.com/id/1224916255/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%8B%E0%B8%B9%E0%B8%8A%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%81%E0%B8%B4%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B9%81%E0%B8%8B%E0%B8%A5%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87%E0%B9%81%E0%B8%95%E0%B8%87%E0%B8%81%E0%B8%A7%E0%B8%B2.jpg?s=612x612&w=0&k=20&c=WrspGGUz2XpkWYfF11f_HDN6Vwx_wu-HF07d15WUHRk=",
    },
    {
        menuId: "A03",
        name: "ปลาหมึกกล้วยทั้งตัว",
        price: 40,
        discount: 0,
        netPrice: 40,
        categoryName: "ซูชิ",
        imageUrl: "https://sushiro.co.th/wp-content/uploads/2021/03/071.jpg",
    },
    {
        menuId: "A04",
        name: "คานิคามะกับหัวหอม",
        price: 40,
        discount: 0,
        netPrice: 40,
        categoryName: "ซูชิ",
        imageUrl: "https://sushiro.co.th/wp-content/uploads/2021/03/067.jpg",
    },
    {
        menuId: "A05",
        name: "ปลาหมึกกับไข่ปลาทาราโกะ",
        price: 60,
        discount: 0,
        netPrice: 60,
        categoryName: "ซูชิ",
        imageUrl: "https://sushiro.co.th/wp-content/uploads/2021/03/072.jpg",
    },
    {
        menuId: "A06",
        name: "กุ้งแดงใหญ่ย่างกับเลมอนโรยเกลือ",
        price: 40,
        discount: 0,
        netPrice: 40,
        categoryName: "ซูชิ",
        imageUrl: "https://sushiro.co.th/wp-content/uploads/2021/03/057-2.jpg",
    },
    {
        menuId: "A07",
        name: "กุ้งย่างชีท",
        price: 40,
        discount: 0,
        netPrice: 40,
        categoryName: "ซูชิ",
        imageUrl: "https://sushiro.co.th/wp-content/uploads/2021/03/053.jpg",
    },
    {
        menuId: "A08",
        name: "มารูโกะ",
        price: 40,
        discount: 0,
        netPrice: 40,
        categoryName: "ซูชิ",
        imageUrl: "https://sushiro.co.th/wp-content/uploads/2021/03/001.jpg",
    },
    {
        menuId: "B01",
        name: "ซูชิแซลมอน",
        price: 180,
        discount: 21,
        netPrice: 159,
        categoryName: "ชุดเซทซูชิ",
        imageUrl:
            "https://images.unsplash.com/photo-1680675228874-9b9963812b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzdXNoaSUyMG5pZ2lyaXxlbnwxfHx8fDE3NjM5NzAzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        menuId: "B02",
        name: "เซทซูชิพิเศษ",
        price: 480,
        discount: 81,
        netPrice: 399,
        categoryName: "ชุดเซทซูชิ",
        imageUrl:
            "https://images.unsplash.com/photo-1696091811927-6b9552931f70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGNvbWJvJTIwc2V0fGVufDF8fHx8MTc2NDAxMzQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        menuId: "B03",
        name: "ซูชิมินิเซต A",
        price: 100,
        discount: 0,
        netPrice: 100,
        categoryName: "ชุดเซทซูชิ",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/mini-sushi-set-a.jpg?v=1",
    },
    {
        menuId: "B04",
        name: "ซูชิมินิเซต B",
        price: 100,
        discount: 0,
        netPrice: 100,
        categoryName: "ชุดเซทซูชิ",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/sushi_minisetB500x500.jpg?v=1",
    },
    {
        menuId: "B05",
        name: "ซูชิมินิเซต C",
        price: 100,
        discount: 0,
        netPrice: 100,
        categoryName: "ชุดเซทซูชิ",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/mini-sushi-set-c.jpg?v=1",
    },
    {
        menuId: "B06",
        name: "ซูชิมินิเซต D",
        price: 250,
        discount: 0,
        netPrice: 250,
        categoryName: "ชุดเซทซูชิ",
        imageUrl:
            "https://media.istockphoto.com/id/1053855452/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%8B%E0%B8%B9%E0%B8%8A%E0%B8%B4%E0%B8%9A%E0%B8%99%E0%B8%88%E0%B8%B2%E0%B8%99%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B9%84%E0%B8%9C%E0%B9%88.jpg?s=612x612&w=0&k=20&c=26MP9xeXpK2dn3Nad0d9Uj0Yr5CXjIqFn9p2rFuOq7k=",
    },
    {
        menuId: "C01",
        name: "คอมโบปาร์ตี้",
        price: 450,
        discount: 0,
        netPrice: 450,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://images.unsplash.com/photo-1638866381709-071747b518c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwc2FzaGltaXxlbnwxfHx8fDE3NjQwNTYzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        menuId: "C02",
        name: "แคลิฟอร์เนียโรล",
        price: 150,
        discount: 21,
        netPrice: 129,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpZm9ybmlhJTIwcm9sbCUyMHN1c2hpfGVufDF8fHx8MTc2Mzk3MDMyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        menuId: "C03",
        name: "เซทซูชิพรีเมี่ยม",
        price: 650,
        discount: 0,
        netPrice: 650,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzYzOTk1MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        menuId: "C04",
        name: "คอมโบ ปาร์ตี้เซต",
        price: 1300,
        discount: 75,
        netPrice: 1225,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/combo-party-sushi-sashimi.jpg?v=1",
    },
    {
        menuId: "C05",
        name: "แซลมอน เลิฟเวอร์",
        price: 1400,
        discount: 250,
        netPrice: 1150,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/salmon-lover.jpg?v=1",
    },
    {
        menuId: "C06",
        name: "มินิ มัสสึ ปาร์ตี้เซต",
        price: 900,
        discount: 0,
        netPrice: 900,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/matsu-mini-party.jpg?v=1",
    },
    {
        menuId: "C07",
        name: "แซลมอนฟลาวเวอร์",
        price: 1350,
        discount: 21,
        netPrice: 1329,
        categoryName: "ชุดปาร์ตี้",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/salmon-flower.jpg?v=1",
    },
    {
        menuId: "D01",
        name: "แซลมอน ซาชิมิ ไซส์ XS (160กรัม)",
        price: 300,
        discount: 0,
        netPrice: 300,
        categoryName: "ซาชิมิ",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/salmon-sashimi-xs.png?v=1",
    },
    {
        menuId: "D02",
        name: "พรีเมียมซาชิมิ เซต A",
        price: 590,
        discount: 21,
        netPrice: 569,
        categoryName: "ซาชิมิ",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/premium-sashimi-set-a.jpg?v=1",
    },
    {
        menuId: "E01",
        name: "ชาไทย",
        price: 49,
        discount: 0,
        netPrice: 49,
        categoryName: "เครื่องดื่ม",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/thai-black-tea.jpg?v=1",
    },
    {
        menuId: "E02",
        name: "ชาไทยลาเต้",
        price: 49,
        discount: 0,
        netPrice: 49,
        categoryName: "เครื่องดื่ม",
        imageUrl:
            "https://www.wakanafooddelivery.com/images/product/%E0%B8%8A%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%A5%E0%B8%B2%E0%B9%80%E0%B8%95%E0%B9%89500x500.jpg?v=1",
    },
];

export async function seedMenu() {
    console.log("🗑️ Clearing menus & categories...");
    await db.execute(sql`DELETE FROM Menu`);
    await db.execute(sql`DELETE FROM Category`);
    await db.execute(sql`DELETE FROM MenuType`);

    console.log("🍣 Inserting categories...");
    await db.insert(categories).values(CATEGORY_SEED);

    console.log("📑 Inserting menu types...");
    await db.insert(menuTypes).values(MENUTYPE_SEED);

    const categoryIdByName = {};
    for (const c of CATEGORY_SEED) {
        categoryIdByName[c.name] = c.id;
    }

    const menuTypeIdByName = {};
    for (const mt of MENUTYPE_SEED) {
        menuTypeIdByName[mt.name] = mt.id;
    }

    console.log("🍱 Inserting menus...");
    await db.insert(menu).values(
        MENU_SEED.map((m) => {
            const isDrink = m.categoryName === "เครื่องดื่ม";
            const typeName = isDrink ? "เครื่องดื่ม" : "อาหาร";
            return {
                name: m.name,
                price: m.price,
                discount: m.discount,
                netPrice: m.netPrice,
                detail: null,
                categoryId: categoryIdByName[m.categoryName],
                menuTypeId: menuTypeIdByName[typeName],
                storeId: DEFAULT_STORE_ID,
                imageUrl: m.imageUrl,
            };
        })
    );

    console.log("✅ Menu seed finished!");
}

// if run directly: `node scripts/seedMenu.js`
seedMenu()
    .catch((err) => {
        console.error("❌ Seed error:", err);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
