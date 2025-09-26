import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const db = new sqlite3.Database(path.resolve(import.meta.dir, "app.db"));
const raw = fs.readFileSync("users.json", "utf-8");
const users: { username: string; password: string }[] = JSON.parse(raw);

db.serialize(async () => {
  db.run("DROP TABLE IF EXISTS users");

  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      coins INTEGER DEFAULT 0,
      unlocked_chests TEXT DEFAULT '[]',
      collected_chests TEXT DEFAULT '[]'
    )
  `);

  const insert = db.prepare(
    "INSERT INTO users (username, password, coins) VALUES (?, ?, ?)",
  );

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    insert.run(u.username, hash, 0);
  }

  insert.finalize();
  console.log("✅ Database setup complete with predefined users.");
});
