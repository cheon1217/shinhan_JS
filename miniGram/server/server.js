import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db/db.js';
import likesRouter from './routes/likes.js';
import hashtagsRouter from './routes/hashtags.js';
import reviewsRouter from './routes/reviews.js';
import reviewLikesRouter from './routes/reviewLikes.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// DB 연결 확인 라우트
// app.get('/api/db-check', (req, res) => {
//   try {
//     const result = db.prepare('SELECT 1').get();
//     res.json({ ok: true, result });
//   } catch (err) {
//     res.status(500).json({ ok: false, error: err.message });
//   }
// });

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/hashtags', hashtagsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/review-likes', reviewLikesRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
