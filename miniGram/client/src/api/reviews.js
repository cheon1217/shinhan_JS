import axios from 'axios';

// 댓글 목록 조회
export const fetchReviews = (postId) =>
  axios.get(`/api/reviews/${postId}`);

// 댓글 작성
export const createReview = (postId, content, token) =>
  axios.post(`/api/reviews/${postId}`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 댓글 수정
export const updateReview = (reviewId, content, token) =>
  axios.put(`/api/reviews/${reviewId}`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 댓글 삭제
export const deleteReview = (reviewId, token) =>
  axios.delete(`/api/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });