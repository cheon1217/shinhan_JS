import Database from 'better-sqlite3';
const db = new Database('minigram.db');

try {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUrl TEXT,
      title TEXT,
      description TEXT,
      authorId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users(id)
    )
  `).run();
} catch (err) {
  console.error('DB 테이블 생성 오류:', err);
}

export default db;
