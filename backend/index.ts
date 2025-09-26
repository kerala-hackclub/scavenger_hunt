import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

import type { Request, Response, NextFunction } from "express";

const app = express();
const db = new sqlite3.Database(path.resolve(import.meta.dir, "app.db"));

// ⚠️ Use env var in production
const SECRET = process.env.JWT_SECRET!;

app.use(express.json());

interface JwtPayload {
  id: number;
  username: string;
}

// Extend Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ---------------------- AUTH MIDDLEWARE ----------------------
function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as JwtPayload;
    next();
  });
}

// ---------------------- LOGIN ----------------------
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user: any) => {
      if (err || !user)
        return res.status(401).json({ error: "Invalid credentials" });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    },
  );
});

// ---------------------- USER DATA ----------------------
app.get("/me", auth, (req: Request, res: Response) => {
  db.get(
    "SELECT username, coins, unlocked_chests, collected_chests FROM users WHERE id = ?",
    [req.user!.id],
    (err, user: any) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({
        username: user.username,
        coins: user.coins,
        unlocked: JSON.parse(user.unlocked_chests),
        collected: JSON.parse(user.collected_chests),
      });
    },
  );
});

// ---------------------- COINS ----------------------
app.post("/coins", auth, (req: Request, res: Response) => {
  const { amount } = req.body;
  db.run(
    "UPDATE users SET coins = coins + ? WHERE id = ?",
    [amount, req.user!.id],
    function (err) {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ success: true });
    },
  );
});

// ---------------------- CHESTS ----------------------
app.post("/unlock", auth, (req: Request, res: Response) => {
  const { chestId } = req.body;
  db.get(
    "SELECT unlocked_chests FROM users WHERE id = ?",
    [req.user!.id],
    (err, row: any) => {
      if (err) return res.status(500).json({ error: "DB error" });
      let unlocked: number[] = JSON.parse(row.unlocked_chests);
      if (!unlocked.includes(chestId)) unlocked.push(chestId);
      db.run(
        "UPDATE users SET unlocked_chests = ? WHERE id = ?",
        [JSON.stringify(unlocked), req.user!.id],
        (err2) => {
          if (err2) return res.status(500).json({ error: "DB error" });
          res.json({ success: true, unlocked });
        },
      );
    },
  );
});

app.post("/collect", auth, (req: Request, res: Response) => {
  const { chestId } = req.body;
  db.get(
    "SELECT collected_chests FROM users WHERE id = ?",
    [req.user!.id],
    (err, row: any) => {
      if (err) return res.status(500).json({ error: "DB error" });
      let collected: number[] = JSON.parse(row.collected_chests);
      if (!collected.includes(chestId)) collected.push(chestId);
      db.run(
        "UPDATE users SET collected_chests = ? WHERE id = ?",
        [JSON.stringify(collected), req.user!.id],
        (err2) => {
          if (err2) return res.status(500).json({ error: "DB error" });
          res.json({ success: true, collected });
        },
      );
    },
  );
});

// ---------------------- SERVER ----------------------
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
