import { Router } from 'express';
import db from '../db/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// 내 정보 조회
router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(req.userId);
  res.json(user);
});

// 내가 올린 게시물
router.get('/me/posts', auth, (req, res) => {
  const posts = db.prepare('SELECT * FROM posts WHERE authorId = ? ORDER BY id DESC').all(req.userId);
  res.json(posts);
});

// 내가 좋아요 누른 게시물
router.get('/me/liked-posts', auth, (req, res) => {
  const posts = db.prepare(`
    SELECT p.* FROM posts p
    JOIN likes l ON l.postId = p.id
    WHERE l.userId = ?
    ORDER BY l.id DESC
  `).all(req.userId);
  res.json(posts);
});

export default router;