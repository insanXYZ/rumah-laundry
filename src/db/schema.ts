import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

export const adminsTable = mysqlTable("admins", {
  id: serial().primaryKey(),
  name: varchar({
    length: 100,
  }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});

export const santrisTable = mysqlTable("santris", {
  id: serial().primaryKey(),
  name: varchar({
    length: 100,
  }).notNull(),
  class: varchar({
    length: 50,
  }).notNull(),
  number_phone: varchar({
    length: 20,
  }).notNull(),
  created_at: timestamp().defaultNow(),
});
