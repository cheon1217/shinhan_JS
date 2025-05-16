import { Router } from 'express';
import db from '../db/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// 댓글 등록 (이미 구현됨)
router.post('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  db.prepare(`
    INSERT INTO reviews (postId, userId, content) VALUES (?, ?, ?)
  `).run(postId, req.userId, content);
  res.json({ message: '댓글 작성 완료' });
});

// 댓글 수정
router.put('/:reviewId', auth, (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;
  const review = db.prepare(`SELECT * FROM reviews WHERE id = ?`).get(reviewId);
  if (!review || review.userId !== req.userId) return res.status(403).json({ message: '권한 없음' });
  db.prepare(`UPDATE reviews SET content = ? WHERE id = ?`).run(content, reviewId);
  res.json({ message: '댓글 수정 완료' });
});

// 댓글 삭제
router.delete('/:reviewId', auth, (req, res) => {
  const { reviewId } = req.params;
  const review = db.prepare(`SELECT * FROM reviews WHERE id = ?`).get(reviewId);
  if (!review || review.userId !== req.userId) return res.status(403).json({ message: '권한 없음' });
  db.prepare(`DELETE FROM reviews WHERE id = ?`).run(reviewId);
  res.json({ message: '댓글 삭제 완료' });
});

// 게시물의 댓글 목록
router.get('/:postId', (req, res) => {
  const { postId } = req.params;
  const reviews = db.prepare(`
    SELECT reviews.*, users.username FROM reviews
    JOIN users ON reviews.userId = users.id
    WHERE postId = ?
    ORDER BY createdAt ASC
  `).all(postId);
  res.json(reviews);
});

export default router;