import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "./blog.db");

const sqlite = sqlite3.verbose();

const db = new sqlite.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("connected to database");
  }
);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            img TEXT)`,
    (err) => {
      if (err) {
        return console.log(err.message);
      }
      console.log("database created.");

      db.run(`DELETE FROM blogs`, (err) => {
        if (err) {
          return console.log(err.message);
        }

        console.log("database clear...");

        const row1 = [
          "Blog Title 1",
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam minima tempora ullam molestias sunt tenetur voluptates laborum ad laboriosam. Consequatur impedit quo nesciunt voluptates similique ad eligendi dolor a consequuntur!",
          "1.jpg",
        ];

        const row2 = [
          "Blog Title 2",
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam minima tempora ullam molestias sunt tenetur voluptates laborum ad laboriosam. Consequatur impedit quo nesciunt voluptates similique ad eligendi dolor a consequuntur!",
          "2.jpg",
        ];

        const row3 = [
          "Blog Title 3",
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam minima tempora ullam molestias sunt tenetur voluptates laborum ad laboriosam. Consequatur impedit quo nesciunt voluptates similique ad eligendi dolor a consequuntur!",
          "3.jpg",
        ];
        const row4 = [
          "Blog Title 4",
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam minima tempora ullam molestias sunt tenetur voluptates laborum ad laboriosam. Consequatur impedit quo nesciunt voluptates similique ad eligendi dolor a consequuntur!",
          "4.jpg",
        ];

        const sql = `INSERT INTO blogs(name,description,img) VALUES(?,?,?)`;

        db.run(sql, row1, function (err) {
          if (err) {
            return console.log(err.message);
          }
          const id = this.lastID;
          console.log("last inserted id" + id);
        });

        db.run(sql, row2, function (err) {
          if (err) {
            return console.log(err.message);
          }
          const id = this.lastID;
          console.log("last inserted id" + id);
        });

        db.run(sql, row3, function (err) {
          if (err) {
            return console.log(err.message);
          }
          const id = this.lastID;
          console.log("last inserted id" + id);
        });

        db.run(sql, row4, function (err) {
          if (err) {
            return console.log(err.message);
          }
          const id = this.lastID;
          console.log("last inserted id" + id);
        });
      });
    }
  );
});
