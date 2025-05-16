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

  // 좋아요 테이블 (N:N)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      postId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (postId) REFERENCES posts(id),
      UNIQUE(userId, postId)
    )
  `).run();

  // 해시태그 테이블
  db.prepare(`
    CREATE TABLE IF NOT EXISTS hashtags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT UNIQUE
    )
  `).run();

  // 게시물-해시태그 연결 테이블 (N:N)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS post_hashtags (
      postId INTEGER,
      hashtagId INTEGER,
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (hashtagId) REFERENCES hashtags(id),
      PRIMARY KEY (postId, hashtagId)
    )
  `).run();

  // 리뷰(댓글) 테이블
  db.prepare(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER,
      userId INTEGER,
      content TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `).run();

  // 리뷰 좋아요 테이블
  db.prepare(`
    CREATE TABLE IF NOT EXISTS review_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      reviewId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (reviewId) REFERENCES reviews(id),
      UNIQUE(userId, reviewId)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS email_verification (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      code TEXT,
      expires INTEGER, -- UNIX timestamp(ms)
      verified INTEGER DEFAULT 0
    )
  `).run();

} catch (err) {
  console.error('DB 테이블 생성 오류:', err);
}

export default db;
