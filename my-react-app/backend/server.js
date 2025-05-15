import express, { json } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 5000;

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('./applegame.db', (err) => {
  if (err) {
    console.error('SQLite3 연결 오류:', err.message);
  } else {
    console.log('SQLite3 데이터베이스 연결 성공');
  }
});

app.use(cors());
app.use(json());

// 회원가입
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
  }

  const userCheckQuery = `SELECT COUNT(*) AS count FROM users WHERE username = ?`;
  db.get(userCheckQuery, [username], (err, row) => {
    if (err) {
      console.error('회원가입 오류:', err.message);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (row.count > 0) {
      return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
    }

    const insertUserQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(insertUserQuery, [username, password], function (err) {
      if (err) {
        console.error('회원가입 오류:', err.message);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }

      res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    });
  });
});

// 로그인
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const loginQuery = `SELECT id FROM users WHERE username = ? AND password = ?`;
  db.get(loginQuery, [username, password], (err, row) => {
    if (err) {
      console.error('로그인 오류:', err.message);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (!row) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const userId = row.id;

    // 해당 사용자의 점수를 가져오는 쿼리
    const userScoresQuery = `
      SELECT s.score, u.username
      FROM scores s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
      ORDER BY s.id DESC
    `;
    db.all(userScoresQuery, [userId], (err, scores) => {
      if (err) {
        console.error('점수 조회 오류:', err.message);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }

      res.status(200).json({ message: '로그인 성공', username, scores });
    });
  });
});

// 점수 저장
app.post('/api/scores', (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== 'number') {
    return res.status(400).json({ error: '아이디와 점수를 올바르게 입력하세요.' });
  }

  const userQuery = `SELECT id FROM users WHERE username = ?`;
  db.get(userQuery, [username], (err, row) => {
    if (err) {
      console.error('점수 저장 오류:', err.message);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (!row) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const userId = row.id;
    const insertScoreQuery = `INSERT INTO scores (user_id, score) VALUES (?, ?)`;
    db.run(insertScoreQuery, [userId, score], function (err) {
      if (err) {
        console.error('점수 저장 오류:', err.message);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }

      res.status(200).json({ message: '점수가 저장되었습니다.' });
    });
  });
});

// 상위 점수 가져오기
app.get('/api/scores', (req, res) => {
  const { sort = 'desc', limit = 5, page = 1 } = req.query; // 기본값 설정
  const offset = (page - 1) * limit; // 페이지에 따른 시작 위치 계산

  const query = `
    SELECT u.username, s.score
    FROM scores s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.score ${sort.toUpperCase()}
    LIMIT ? OFFSET ?
  `;

  db.all(query, [Number(limit), Number(offset)], (err, rows) => {
    if (err) {
      console.error('점수 조회 오류:', err.message);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    res.status(200).json(rows); // 올바른 데이터 반환
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});