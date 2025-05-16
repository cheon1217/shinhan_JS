import { Router } from 'express';
import { prepare } from '../db/init';
import { multi } from '../middleware/upload';
import auth from '../middleware/auth';
const router = Router();

router.post('/', auth, multi, (req, res) => {
  const { title, description } = req.body;
  const createdAt = new Date().toISOString();

  // 여러 이미지 경로를 JSON 문자열로 저장
  const imageUrls = req.files.map(f => `/uploads/${f.filename}`);
  prepare(`
    INSERT INTO posts (imageUrl, title, description, createdAt, userId)
    VALUES (?, ?, ?, ?, ?)
  `).run(JSON.stringify(imageUrls), title, description, createdAt, req.userId);

  res.json({ message: '포스트 업로드 완료', imageUrls });
});

router.get('/', (_, res) => {
  const posts = prepare(`
    SELECT posts.*, users.username FROM posts
    JOIN users ON posts.userId = users.id
    ORDER BY posts.createdAt DESC
  `).all();

  res.json(posts);
});

export default router;
