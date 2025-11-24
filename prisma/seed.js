import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv"

dotenv.config()

console.log(process.env.DATABASE_URL)

const adapter = new PrismaMariaDb({
    host: "shuttle.proxy.rlwy.net",
    user: "root",
    password: "kpNUEDZxNEQbtwsuvVDsxuBwIfDOBZbV",
    database: "railway",
    port: 19622,
    connectionLimit: 5,
    connectTimeout: 20000
})
const prisma = new PrismaClient({ adapter });

async function main() {
    // ---- 1. สร้าง SuperAdmin ----
    const superAdmin = await prisma.admin.create({
        data: {
            name: "Super Admin",
            username: "superadmin",
            password: "123456",
            role: "superadmin",
        },
    });

    // ---- 2. สร้าง Admin ----
    const admin = await prisma.admin.create({
        data: {
            name: "Admin Garfield",
            username: "garfield",
            password: "123456",
            role: "admin",
        },
    });

    // ---- 3. สร้าง Store ----
    const store = await prisma.store.create({
        data: {
            name: "Garfield Café",
            address: "Bangkok",
            vat: 7,
            serviceCharge: 10,
            adminId: admin.id,
        },
    });

    // ---- 4. สร้าง TableType ----
    const tableType = await prisma.tableType.create({
        data: {
            nameType: "Standard Table",
            minSeat: 2,
            maxSeat: 4,
            storeId: store.id,
        },
    });

    // ---- 5. สร้าง Table ----
    await prisma.table.createMany({
        data: [
            { zone: "A", tableTypeId: tableType.id, storeId: store.id },
            { zone: "B", tableTypeId: tableType.id, storeId: store.id },
        ],
    });

    // ---- 6. สร้าง Category ----
    const category = await prisma.category.create({
        data: {
            name: "Drinks",
            detail: "Coffee and tea",
        },
    });

    // ---- 7. สร้าง Menu ----
    const menu = await prisma.menu.create({
        data: {
            name: "Iced Latte",
            price: 65,
            detail: "Freshly brewed iced latte",
            categoryId: category.id,
            storeId: store.id,
        },
    });

    // ---- 8. สร้าง Discount ----
    await prisma.discount.create({
        data: {
            code: "WELCOME10",
            expiredAt: new Date("2025-12-31"),
            isActive: true,
            storeId: store.id,
        },
    });

    console.log("✅ Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });