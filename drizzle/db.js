import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DATABASE_URL);
// const pool = mysql.createPool({
//   url: "mysql://root:kpNUEDZxNEQbtwsuvVDsxuBwIfDOBZbV@shuttle.proxy.rlwy.net:19622/railway",
//     connectTimeout: 60000,
// });

const pool = mysql.createPool({
  host: "shuttle.proxy.rlwy.net",
  port: 19622,
  user: "root",
  password: "kpNUEDZxNEQbtwsuvVDsxuBwIfDOBZbV",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: "default" });
