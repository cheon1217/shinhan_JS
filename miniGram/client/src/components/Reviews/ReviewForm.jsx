import React, { useState } from 'react';
import { createReview } from '../../api/reviews';

export default function ReviewForm({ postId, onReviewCreated }) {
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('로그인이 필요합니다.');
      return;
    }
    try {
      await createReview(postId, content, token);
      setContent('');
      setMsg('');
      if (onReviewCreated) onReviewCreated();
    } catch (e) {
      setMsg('댓글 등록 실패: ' + e.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={content} onChange={e=>setContent(e.target.value)} placeholder="댓글 입력" required />
      <button type="submit">등록</button>
      <span style={{ marginLeft: 8, color: 'red' }}>{msg}</span>
    </form>
  );
}