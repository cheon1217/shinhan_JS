import React, { useEffect, useState } from 'react';
import { fetchReviews } from '../../api/reviews';
import ReviewForm from './ReviewForm';

export default function ReviewList({ postId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews(postId).then(res => setReviews(res.data));
  }, [postId]);

  const handleReviewCreated = () => {
    fetchReviews(postId).then(res => setReviews(res.data));
  };

  return (
    <div>
      <h4>댓글</h4>
      <ReviewForm postId={postId} onReviewCreated={handleReviewCreated} />
      {reviews.map(r => (
        <div key={r.id} style={{ borderBottom: '1px solid #eee', marginBottom: 4 }}>
          <b>{r.username}</b>: {r.content}
        </div>
      ))}
    </div>
  );
}