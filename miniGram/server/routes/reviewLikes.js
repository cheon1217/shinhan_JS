import { Router } from 'express';
import db from '../db/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// 리뷰 좋아요 추가
router.post('/:reviewId', auth, (req, res) => {
  const { reviewId } = req.params;
  try {
    db.prepare(`
      INSERT INTO review_likes (userId, reviewId) VALUES (?, ?)
    `).run(req.userId, reviewId);
    res.json({ liked: true });
  } catch {
    res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
  }
});

// 리뷰 좋아요 취소
router.delete('/:reviewId', auth, (req, res) => {
  const { reviewId } = req.params;
  db.prepare(`
    DELETE FROM review_likes WHERE userId = ? AND reviewId = ?
  `).run(req.userId, reviewId);
  res.json({ liked: false });
});

// 리뷰별 좋아요 개수
router.get('/:reviewId/count', (req, res) => {
  const { reviewId } = req.params;
  const row = db.prepare(`
    SELECT COUNT(*) as count FROM review_likes WHERE reviewId = ?
  `).get(reviewId);
  res.json({ count: row.count });
});

export default router;