import { Router } from 'express';
import db from '../db/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// 게시물에 해시태그 추가
router.post('/:postId', auth, (req, res) => {
  const { postId } = req.params;
  const { tags } = req.body; // tags: ['tag1', 'tag2']
  if (!Array.isArray(tags)) return res.status(400).json({ message: 'tags 배열 필요' });

  tags.forEach(tag => {
    // 해시태그가 없으면 생성
    let tagRow = db.prepare(`SELECT id FROM hashtags WHERE tag = ?`).get(tag);
    if (!tagRow) {
      db.prepare(`INSERT INTO hashtags (tag) VALUES (?)`).run(tag);
      tagRow = db.prepare(`SELECT id FROM hashtags WHERE tag = ?`).get(tag);
    }
    // 연결 테이블에 추가
    try {
      db.prepare(`INSERT INTO post_hashtags (postId, hashtagId) VALUES (?, ?)`).run(postId, tagRow.id);
    } catch {}
  });

  res.json({ message: '해시태그 추가 완료' });
});

// 게시물의 해시태그 조회
router.get('/:postId', (req, res) => {
  const { postId } = req.params;
  const tags = db.prepare(`
    SELECT h.tag FROM hashtags h
    JOIN post_hashtags ph ON h.id = ph.hashtagId
    WHERE ph.postId = ?
  `).all(postId).map(row => row.tag);
  res.json({ tags });
});

export default router;