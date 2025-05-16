import { Router } from 'express';
import db from '../db/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// 좋아요 추가
router.post('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  try {
    db.prepare(`
      INSERT INTO likes (userId, postId) VALUES (?, ?)
    `).run(req.userId, postId);
    res.json({ liked: true });
  } catch {
    res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
  }
});

// 좋아요 취소
router.delete('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  db.prepare(`
    DELETE FROM likes WHERE userId = ? AND postId = ?
  `).run(req.userId, postId);
  res.json({ liked: false });
});

// 게시물별 좋아요 개수
router.get('/:postId/count', (req, res) => {
  const { postId } = req.params;
  const row = db.prepare(`
    SELECT COUNT(*) as count FROM likes WHERE postId = ?
  `).get(postId);
  res.json({ count: row.count });
});

export default router;