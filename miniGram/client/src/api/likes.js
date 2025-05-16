import axios from 'axios';

// 게시물 좋아요 추가
export const likePost = (postId, token) =>
  axios.post(`/api/likes/${postId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 게시물 좋아요 취소
export const unlikePost = (postId, token) =>
  axios.delete(`/api/likes/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 게시물 좋아요 개수 조회
export const getPostLikeCount = (postId) =>
  axios.get(`/api/likes/${postId}/count`);