import React, { useEffect, useState } from 'react';
import { likeReview, unlikeReview, getReviewLikeCount } from '../../api/reviewLikes';

export default function ReviewLikeButton({ reviewId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    getReviewLikeCount(reviewId).then(res => setCount(res.data.count));
    // 실제 liked 여부는 별도 API 필요, 여기선 단순화
  }, [reviewId]);

  const handleLike = async () => {
    if (!token) return alert('로그인 필요');
    if (liked) {
      await unlikeReview(reviewId, token);
      setLiked(false);
      setCount(c => c - 1);
    } else {
      await likeReview(reviewId, token);
      setLiked(true);
      setCount(c => c + 1);
    }
  };

  return (
    <button onClick={handleLike}>
      {liked ? '👍' : '👍🏻'} {count}
    </button>
  );
}