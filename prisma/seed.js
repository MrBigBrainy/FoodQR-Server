import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log("🗑️ Clearing all data...");

    await prisma.bill.deleteMany({});
    await prisma.orderUser.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.discount.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.menuType.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.table.deleteMany({});
    await prisma.tableType.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.admin.deleteMany({});

    console.log("✅ Database cleared!");
}

async function main() {
    await clearDatabase();

    console.log("⏳ Creating new seed data...");

    // const superAdmin = await prisma.admin.create({
    //     data: {
    //         name: "Super Admin",
    //         username: "superadmin",
    //         password: "123456",
    //         role: "superadmin",
    //     },
    // });

    // console.log("🎉 Seeding done!");
}

main()
    .catch((err) => {
        console.error("❌ Seed error:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
