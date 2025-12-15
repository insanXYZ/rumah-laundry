import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!, {
  // logger: true,
});

export default db;
