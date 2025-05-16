import React, { useEffect, useState } from 'react';
import { likePost, unlikePost, getPostLikeCount } from '../../api/likes';

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    getPostLikeCount(postId).then(res => setCount(res.data.count));
    // 실제 liked 여부는 별도 API 필요, 여기선 단순화
  }, [postId]);

  const handleLike = async () => {
    if (!token) return alert('로그인 필요');
    if (liked) {
      await unlikePost(postId, token);
      setLiked(false);
      setCount(c => c - 1);
    } else {
      await likePost(postId, token);
      setLiked(true);
      setCount(c => c + 1);
    }
  };

  return (
    <button onClick={handleLike}>
      {liked ? '❤️' : '🤍'} {count}
    </button>
  );
}