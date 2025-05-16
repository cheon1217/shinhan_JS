import axios from 'axios';

// 게시물에 해시태그 추가
export const addHashtags = (postId, tags, token) =>
  axios.post(`/api/hashtags/${postId}`, { tags }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 게시물의 해시태그 조회
export const fetchHashtags = (postId) =>
  axios.get(`/api/hashtags/${postId}`);