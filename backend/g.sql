CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  coins INTEGER DEFAULT 0,
  unlocked_chests TEXT DEFAULT '[]',   
  collected_chests TEXT DEFAULT '[]'   
);

