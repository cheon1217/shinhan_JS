const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = 3000;
const OMDB_API_KEY = '8f51ab91'; // 실제 키로 교체 권장

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../public')));

// 프록시 엔드포인트
app.get('/api/movie', async (req, res) => {
  const title = req.query.title;
  if (!title) return res.status(400).json({ error: 'No title provided' });

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'OMDb API error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
