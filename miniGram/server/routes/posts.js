import { Router } from 'express';
import db from '../db/db.js';
import { multi } from '../middleware/upload.js';
import auth from '../middleware/auth.js';

const router = Router();

// 게시물 등록 (이미 구현됨)
router.post('/', auth, multi, (req, res) => {
  const { title, description } = req.body;
  const imageUrls = req.files.map(f => `/uploads/${f.filename}`);
  db.prepare(`
    INSERT INTO posts (imageUrl, title, description, authorId)
    VALUES (?, ?, ?, ?)
  `).run(JSON.stringify(imageUrls), title, description, req.userId);
  res.json({ message: '포스트 업로드 완료', imageUrls });
});

// 게시물 수정
router.put('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;
  // 본인 게시물만 수정 가능
  const post = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
  if (!post || post.authorId !== req.userId) return res.status(403).json({ message: '권한 없음' });
  db.prepare(`UPDATE posts SET title = ?, description = ? WHERE id = ?`).run(title, description, postId);
  res.json({ message: '수정 완료' });
});

// 게시물 삭제
router.delete('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  const post = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
  if (!post || post.authorId !== req.userId) return res.status(403).json({ message: '권한 없음' });
  db.prepare(`DELETE FROM posts WHERE id = ?`).run(postId);
  res.json({ message: '삭제 완료' });
});

export default router;
