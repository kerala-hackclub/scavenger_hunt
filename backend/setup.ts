import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import path from "path";

const db = new sqlite3.Database(path.resolve(import.meta.dir, "app.db"));

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

  const users = [
    { username: "admin", password: "admin123", coins: 100 },
    { username: "player1", password: "pass123", coins: 50 },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    insert.run(u.username, hash, u.coins);
  }

  insert.finalize();
  console.log("✅ Database setup complete with predefined users.");
});
