import {
  bigint,
  decimal,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const adminsTable = mysqlTable("admins", {
  id: serial().primaryKey(),
  name: varchar({
    length: 100,
  }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});

export const customersTable = mysqlTable("customers", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 100,
  }).notNull(),
  class: varchar({
    length: 50,
  }),
  type: varchar({
    length: 10,
  }),
  number_phone: varchar({
    length: 20,
  }).notNull(),
  address: varchar({
    length: 100,
  }),
  created_at: timestamp().defaultNow(),
});

export const productsTable = mysqlTable("products", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 100,
  }).notNull(),
  unit: varchar({
    length: 10,
  }).notNull(),
  price: bigint({
    mode: "number",
  }).notNull(),
  created_at: timestamp().defaultNow(),
});

export const inventoriesTable = mysqlTable("inventories", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 100,
  }).notNull(),
  created_at: timestamp().defaultNow(),
});

export const inventoryStockTable = mysqlTable("inventory_stock", {
  id: int().primaryKey().autoincrement(),
  inventory_id: int()
    .references(() => inventoriesTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  stock: int().notNull(),
  description: varchar({
    length: 255,
  }),
  created_at: timestamp().defaultNow(),
});

export const orderTable = mysqlTable("orders", {
  id: int().primaryKey().autoincrement(),
  customer_id: int()
    .references(() => customersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  status: varchar({
    length: 100,
  }),
  created_at: timestamp().defaultNow(),
});

export const orderItemTable = mysqlTable("order_items", {
  id: int().primaryKey().autoincrement(),
  order_id: int()
    .references(() => orderTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  product_id: int()
    .references(() => productsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: decimal({ precision: 10, scale: 2 }),
  price: int(),
  total_price: int(),
  created_at: timestamp().defaultNow(),
});

export const santriMonthlyMoneyTable = mysqlTable("santri_monthly_moneys", {
  id: int().primaryKey().autoincrement(),
  customer_id: int()
    .references(() => customersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  amount: int().notNull(),
  created_at: timestamp().defaultNow(),
});
