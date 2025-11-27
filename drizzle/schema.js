import {
    mysqlTable,
    int,
    varchar,
    text,
    float,
    boolean,
    timestamp,
    datetime,
    mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ─────────── ENUMS ───────────
export const roleEnum = mysqlEnum("role", ["admin", "superadmin"]);

// ─────────── ADMIN ───────────
export const admins = mysqlTable("Admin", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum.notNull().default("admin"),
});

export const adminsRelations = relations(admins, ({ many }) => ({
    stores: many(stores),
}));

// ─────────── STORE ───────────
export const stores = mysqlTable("Store", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }),
    vat: float("vat"),
    serviceCharge: float("serviceCharge"),
    createAt: timestamp("createAt").notNull().defaultNow(),

    adminId: int("adminId").notNull(),
});

export const storesRelations = relations(stores, ({ one, many }) => ({
    admin: one(admins, {
        fields: [stores.adminId],
        references: [admins.id],
    }),
    tables: many(tables),
    menu: many(menu),
    discounts: many(discounts),
    bills: many(bills),
    tableTypes: many(tableTypes),
    menuTypes: many(menuTypes),
    category: many(category),
}));

// ─────────── TABLE TYPE ───────────
export const tableTypes = mysqlTable("TableType", {
    id: int("id").primaryKey().autoincrement(),
    nameType: varchar("nameType", { length: 255 }).notNull(),
    minSeat: int("minSeat").notNull(),
    maxSeat: int("maxSeat").notNull(),
    storeId: int("storeId").notNull(),
});

export const tableTypesRelations = relations(tableTypes, ({ one, many }) => ({
    store: one(stores, {
        fields: [tableTypes.storeId],
        references: [stores.id],
    }),
    tables: many(tables),
}));

// ─────────── TABLE ───────────
export const tables = mysqlTable("Table", {
    id: int("id").primaryKey().autoincrement(),
    zone: varchar("zone", { length: 255 }),
    tableTypeId: int("tableTypeId").notNull(),
    storeId: int("storeId").notNull(),
});

export const tablesRelations = relations(tables, ({ one, many }) => ({
    store: one(stores, {
        fields: [tables.storeId],
        references: [stores.id],
    }),
    tableType: one(tableTypes, {
        fields: [tables.tableTypeId],
        references: [tableTypes.id],
    }),
    orders: many(orders),
}));

// ─────────── CATEGORY ───────────
export const category = mysqlTable("Category", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    detail: text("detail"),
    storeId: int("storeId").notNull(),
});

export const categoryRelations = relations(category, ({ one, many }) => ({
    store: one(stores, {
        fields: [category.storeId],
        references: [stores.id],
    }),
    menu: many(menu),
}));

// ─────────── MENU ───────────
export const menu = mysqlTable("Menu", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    price: float("price").notNull(),
    detail: text("detail"),
    discount: float("discount"),
    netPrice: float("netPrice").notNull(),
    categoryId: int("categoryId").notNull(),
    storeId: int("storeId").notNull(),
    menuTypeId: int("menuTypeId"),
    imageUrl: text("imageUrl"),
});

export const menuRelations = relations(menu, ({ one, many }) => ({
    store: one(stores, {
        fields: [menu.storeId],
        references: [stores.id],
    }),
    category: one(category, {
        fields: [menu.categoryId],
        references: [category.id],
    }),
    menuType: one(menuTypes, {
        fields: [menu.menuTypeId],
        references: [menuTypes.id],
    }),
    orderUsers: many(orderUsers),
}));

// ─────────── MENUTYPE ───────────
export const menuTypes = mysqlTable("MenuType", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    storeId: int("storeId").notNull(),
});

export const menuTypesRelations = relations(menuTypes, ({ one, many }) => ({
    store: one(stores, {
        fields: [menuTypes.storeId],
        references: [stores.id],
    }),
    menus: many(menu),
}));

// ─────────── DISCOUNT ───────────
export const discounts = mysqlTable("Discount", {
    id: int("id").primaryKey().autoincrement(),
    code: varchar("code", { length: 255 }).notNull().unique(),
    expiredAt: datetime("expiredAt").notNull(),
    maxCount: int("maxCount"),
    startTime: datetime("startTime"),
    endTime: datetime("endTime"),
    isActive: boolean("isActive").notNull().default(true),
    storeId: int("storeId").notNull(),
});

export const discountsRelations = relations(discounts, ({ one, many }) => ({
    store: one(stores, {
        fields: [discounts.storeId],
        references: [stores.id],
    }),
    orders: many(orders),
}));

// ─────────── ORDER ───────────
export const orders = mysqlTable("Order", {
    id: int("id").primaryKey().autoincrement(),
    tableId: int("tableId").notNull(),
    orderUserId: int("orderUserId"), // keep as-is (no relation in Prisma either)
    openTime: datetime("openTime").notNull(),
    closeTime: datetime("closeTime"),
    subtotal: float("subtotal"),
    total: float("total"),
    discountId: int("discountId"),
    status: varchar("status", { length: 255 }),
    billId: int("billId"),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
    table: one(tables, {
        fields: [orders.tableId],
        references: [tables.id],
    }),
    discount: one(discounts, {
        fields: [orders.discountId],
        references: [discounts.id],
    }),
    orderUsers: many(orderUsers),
    bill: one(bills, {
        fields: [orders.billId],
        references: [bills.id],
    }),
}));

// ─────────── ORDER USER ───────────
export const orderUsers = mysqlTable("OrderUser", {
    id: int("id").primaryKey().autoincrement(),
    menuId: int("menuId").notNull(),
    quantity: int("quantity").notNull(),
    orderId: int("orderId").notNull(),
});

export const orderUsersRelations = relations(orderUsers, ({ one }) => ({
    order: one(orders, {
        fields: [orderUsers.orderId],
        references: [orders.id],
    }),
    menu: one(menu, {
        fields: [orderUsers.menuId],
        references: [menu.id],
    }),
}));

// ─────────── BILL ───────────
export const bills = mysqlTable("Bill", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("userId"),
    status: varchar("status", { length: 255 }).notNull(),
    total: float("total").notNull(),
    orderId: int("orderId").notNull(),
    storeId: int("storeId"),
});

export const billsRelations = relations(bills, ({ one, many }) => ({
    store: one(stores, {
        fields: [bills.storeId],
        references: [stores.id],
    }),
    // In Prisma, Bill has Order[]; we model it as:
    orders: many(orders),
}));
