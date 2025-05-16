import { Router } from 'express';
import { prepare } from '../db/init';
import { single } from '../middleware/upload';
import auth from '../middleware/auth';
const router = Router();

router.post('/', auth, single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;
  const createdAt = new Date().toISOString();

  prepare(`
    INSERT INTO posts (imageUrl, title, description, createdAt, userId)
    VALUES (?, ?, ?, ?, ?)
  `).run(imageUrl, title, description, createdAt, req.userId);

  res.json({ message: '포스트 업로드 완료' });
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
