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
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm"; 

// ─────────── ENUMS ───────────
export const roleEnum = mysqlEnum("role", ["admin", "superadmin"]);
export const statusTableEnum = mysqlEnum("statusTable", [
  "available",
  "in_use",
  "call_staff",
  "pay_bill",
]);

// ─────────── TABLES (no relations here) ───────────

// ADMIN
export const admins = mysqlTable("Admin", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum.notNull().default("admin"),
  // optional store link
  storeId: int("storeId"),
});

// STORE
export const stores = mysqlTable("Store", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  vat: float("vat"),
  serviceCharge: float("serviceCharge"),
  createAt: timestamp("createAt").notNull().defaultNow(),
});

// TABLE TYPE
export const tableTypes = mysqlTable("TableType", {
  id: int("id").primaryKey().autoincrement(),
  nameType: varchar("nameType", { length: 255 }).notNull().unique(),
  minSeat: int("minSeat").notNull(),
  maxSeat: int("maxSeat").notNull(),
  storeId: int("storeId").notNull(),
});

// ZONE
export const zones = mysqlTable("Zone", {
  id: int("id").primaryKey().autoincrement(),
  zoneName: varchar("zoneName", { length: 255 }).notNull().unique(),
  storeId: int("storeId").notNull(),
});

// TABLES
export const tables = mysqlTable("Tables", {
  id: int("id").primaryKey().autoincrement(),
  tableName: varchar("tableName", { length: 255 }),
  zone: varchar("zone", { length: 255 }), // backward compatibility
  zoneId: int("zoneId"),
  tableTypeId: int("tableTypeId").notNull(),
  storeId: int("storeId").notNull(),
  status: statusTableEnum.default("available"),
});

// CATEGORY
export const category = mysqlTable("Category", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  detail: text("detail"),
  storeId: int("storeId").notNull(),
});

// MENU
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

// MENUTYPE
export const menuTypes = mysqlTable("MenuType", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  storeId: int("storeId").notNull(),
});

// DISCOUNT
export const discountTypeEnum = mysqlEnum("discountType", ["percent", "baht"]);
export const discounts = mysqlTable(
  "Discount",
  {
    id: int("id").primaryKey().autoincrement(),
    code: varchar("code", { length: 255 }).notNull(),
    discountType: discountTypeEnum.notNull().default("percent"),
    amount: int("amount").notNull(),
    maxCount: int("maxCount"),
    count: int("count").notNull().default(0),
    startTime: datetime("startTime"),
    endTime: datetime("endTime"),
    isActive: boolean("isActive").notNull().default(true),
    storeId: int("storeId").notNull(),
  },
  (table) => {
    return {
      codeStoreUnique: uniqueIndex("code_store_unique").on(table.code, table.storeId),
    };
  }
);

// ORDERS
export const orders = mysqlTable("Orders", {
  id: int("id").primaryKey().autoincrement(),
  tableId: int("tableId").notNull(),
  storeId: int("storeId").notNull(),
  customerCount: int("customerCount").notNull(),
  openTime: datetime("openTime").notNull().default(sql`CURRENT_TIMESTAMP`),
  closeTime: datetime("closeTime"),
  subtotal: float("subtotal"),
  total: float("total"),
  discountId: int("discountId"),
  status: varchar("status", { length: 255 }).default("กำลังใช้งาน"),
  billId: int("billId"),
});

// USER ORDER (order items)
export const userOrders = mysqlTable("UserOrder", {
  id: int("id").primaryKey().autoincrement(),
  menuId: int("menuId").notNull(),
  quantity: int("quantity").notNull(),
  orderId: int("orderId").notNull(),
  note: text("note"),
  lineId: varchar("lineId", { length: 255 }),
});

// BILL
export const bills = mysqlTable("Bill", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId"),
  status: varchar("status", { length: 255 }).notNull(),
  total: float("total").notNull(),
  orderId: int("orderId").notNull(),
  storeId: int("storeId"),
});

// REFRESH TOKENS
export const refreshTokens = mysqlTable("RefreshToken", {
  id: int("id").primaryKey().autoincrement(),
  token: varchar("token", { length: 255 }).notNull(),
  staffId: int("staff_id").notNull(),
  expiresAt: datetime("expires_at").notNull(),
});

// STAFF
export const staff = mysqlTable("Staff", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 191 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 191 }).notNull(),
});

// USERS
export const users = mysqlTable("User", {
  id: int("id").primaryKey().autoincrement(),
  lineId: varchar("lineId", { length: 255 }).notNull().unique(),
});

// ─────────── RELATIONS (defined after tables) ───────────

// Admin -> optional one Store
export const adminsRelations = relations(admins, ({ one }) => ({
  store: one(stores, {
    fields: [admins.storeId],
    references: [stores.id],
  }),
}));

// Store -> many Admins (added) and other relations
export const storesRelations = relations(stores, ({ many }) => ({
  admins: many(admins),      // <-- store has many admins
  tables: many(tables),
  menu: many(menu),
  discounts: many(discounts),
  bills: many(bills),
  tableTypes: many(tableTypes),
  menuTypes: many(menuTypes),
  category: many(category),
  zones: many(zones),
}));

// TableType relations
export const tableTypesRelations = relations(tableTypes, ({ one, many }) => ({
  store: one(stores, {
    fields: [tableTypes.storeId],
    references: [stores.id],
  }),
  tables: many(tables),
}));

// Zones relations
export const zonesRelations = relations(zones, ({ one, many }) => ({
  store: one(stores, {
    fields: [zones.storeId],
    references: [stores.id],
  }),
  tables: many(tables),
}));

// Tables relations
export const tablesRelations = relations(tables, ({ one, many }) => ({
  store: one(stores, {
    fields: [tables.storeId],
    references: [stores.id],
  }),
  tableType: one(tableTypes, {
    fields: [tables.tableTypeId],
    references: [tableTypes.id],
  }),
  zone: one(zones, {
    fields: [tables.zoneId],
    references: [zones.id],
  }),
  orders: many(orders),
}));

// Category relations
export const categoryRelations = relations(category, ({ one, many }) => ({
  store: one(stores, {
    fields: [category.storeId],
    references: [stores.id],
  }),
  menu: many(menu),
}));

// Menu relations
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
  userOrders: many(userOrders),
}));

// MenuType relations
export const menuTypesRelations = relations(menuTypes, ({ one, many }) => ({
  store: one(stores, {
    fields: [menuTypes.storeId],
    references: [stores.id],
  }),
  menus: many(menu),
}));

// Discounts relations
export const discountsRelations = relations(discounts, ({ one, many }) => ({
  store: one(stores, {
    fields: [discounts.storeId],
    references: [stores.id],
  }),
  orders: many(orders),
}));

// Orders relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.id],
  }),
  discount: one(discounts, {
    fields: [orders.discountId],
    references: [discounts.id],
  }),
  userOrders: many(userOrders),
  bill: one(bills, {
    fields: [orders.billId],
    references: [bills.id],
  }),
}));

// UserOrders relations
export const userOrdersRelations = relations(userOrders, ({ one }) => ({
  order: one(orders, {
    fields: [userOrders.orderId],
    references: [orders.id],
  }),
  menu: one(menu, {
    fields: [userOrders.menuId],
    references: [menu.id],
  }),
}));

// Bills relations
export const billsRelations = relations(bills, ({ one, many }) => ({
  store: one(stores, {
    fields: [bills.storeId],
    references: [stores.id],
  }),
  orders: many(orders),
}));
