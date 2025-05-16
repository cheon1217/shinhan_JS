require('dotenv').config();
import express from 'express';
import cors from 'cors';
import db from './db/db';
import likesRouter from './routes/likes.js';
import hashtagsRouter from './routes/hashtags.js';
import reviewsRouter from './routes/reviews.js';
import reviewLikesRouter from './routes/reviewLikes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/likes', likesRouter);
app.use('/api/hashtags', hashtagsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/review-likes', reviewLikesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
