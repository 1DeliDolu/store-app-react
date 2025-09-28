import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

async function check() {
  const dbPath = path.resolve(process.cwd(), "blog.db");
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  const rows = await db.all("SELECT * FROM blogs");
  console.log("Blog rows:", rows);

  await db.close();
}

check().catch((err) => {
  console.error("DB check failed:", err);
  process.exit(1);
});
