import axios from 'axios';

// 리뷰 좋아요 추가
export const likeReview = (reviewId, token) =>
  axios.post(`/api/review-likes/${reviewId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 리뷰 좋아요 취소
export const unlikeReview = (reviewId, token) =>
  axios.delete(`/api/review-likes/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 리뷰 좋아요 개수 조회
export const getReviewLikeCount = (reviewId) =>
  axios.get(`/api/review-likes/${reviewId}/count`);