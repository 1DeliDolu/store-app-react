import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

async function seed() {
  const dbPath = path.resolve(process.cwd(), "blog.db");
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      img TEXT
    );
  `);

  // Insert sample rows if table is empty
  const row = await db.get("SELECT COUNT(1) as cnt FROM blogs");
  if (row && row.cnt === 0) {
    const sample = [
      {
        name: "First Post",
        description: "This is the first sample blog post for the seeded DB.",
        img: "sample1.jpg",
      },
      {
        name: "Second Post",
        description: "Another blog post for testing.",
        img: "sample2.jpg",
      },
    ];

    const insert = await db.prepare(
      "INSERT INTO blogs (name, description, img) VALUES (?, ?, ?)"
    );
    try {
      for (const b of sample) {
        await insert.run(b.name, b.description, b.img);
      }
    } finally {
      await insert.finalize();
    }

    console.log("Seeded blogs table with sample data.");
  } else {
    console.log("Blogs table already has data; skipping seeding.");
  }

  await db.close();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
