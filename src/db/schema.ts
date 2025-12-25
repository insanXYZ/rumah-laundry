import {
  bigint,
  boolean,
  datetime,
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export interface Admin {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at?: Date;
}

export const adminTable = mysqlTable("admins", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 100,
  }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});

export interface Customer {
  id?: number;
  name: string;
  class?: string;
  type: string;
  number_phone: string;
  address?: string;
  created_at?: Date;
}

export const customerTable = mysqlTable("customers", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 100,
  }).notNull(),
  class: varchar({
    length: 50,
  }),
  type: varchar({
    length: 10,
  }).notNull(),
  number_phone: varchar({
    length: 20,
  }).notNull(),
  address: varchar({
    length: 100,
  }),
  created_at: timestamp().defaultNow().notNull(),
});

export interface Product {
  id: number;
  name: string;
  unit: string;
  price: number;
  created_at: Date;
}

export const productTable = mysqlTable("products", {
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

export interface Inventory {
  id: number;
  name: string;
  created_at: Date;
  deleted_at?: Date;
}

export const inventoryTable = mysqlTable("inventories", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 100,
  }).notNull(),
  created_at: timestamp().defaultNow(),
  deleted_at: datetime(),
});

export interface InventoryStock {
  id: number;
  inventory_id: number;
  stock: number;
  price: number;
  description?: string;
  created_at: Date;
}

export const inventoryStockTable = mysqlTable("inventory_stock", {
  id: int().primaryKey().autoincrement(),
  inventory_id: int()
    .references(() => inventoryTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  stock: int().notNull(),
  price: int().default(0),
  description: varchar({
    length: 255,
  }),
  created_at: timestamp().defaultNow(),
});

export interface Order {
  id: number;
  customer_id: number;
  status: string;
  created_at: Date;
}

export const orderTable = mysqlTable("orders", {
  id: int().primaryKey().autoincrement(),
  customer_id: int()
    .references(() => customerTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  status: varchar({
    length: 100,
  }),
  created_at: timestamp().defaultNow(),
});

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total_price: number;
  created_at: Date;
}

export const orderItemTable = mysqlTable("order_items", {
  id: int().primaryKey().autoincrement(),
  order_id: int()
    .references(() => orderTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  product_id: int()
    .references(() => productTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: decimal({ precision: 10, scale: 2 }),
  price: int(),
  total_price: int(),
  created_at: timestamp().defaultNow(),
});

export interface SantriMonthlyMoney {
  id: number;
  customer_id: number;
  type: string;
  amount: number;
  created_at: Date;
}

export const santriMonthlyMoneyTable = mysqlTable("santri_monthly_moneys", {
  id: int().primaryKey().autoincrement(),
  customer_id: int()
    .references(() => customerTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: varchar({
    length: 100,
  }).notNull(),
  amount: int().notNull(),
  created_at: timestamp().defaultNow(),
});

export interface ChargeSantri {
  id: number;
  customer_id: number;
  quantity: number;
  total_price: number;
  payed: boolean;
  created_at: Date;
}

export const chargeSantriTable = mysqlTable("charge_santries", {
  id: int().primaryKey().autoincrement(),
  customer_id: int().references(() => customerTable.id, {
    onDelete: "cascade",
  }),
  quantity: decimal({ precision: 10, scale: 2 }),
  total_price: int(),
  payed: boolean().default(false),
  created_at: timestamp().defaultNow(),
});
