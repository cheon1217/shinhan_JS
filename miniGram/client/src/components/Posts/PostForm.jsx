import React, { useState } from 'react';
import { createPost } from '../../api/posts';

export default function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState('');

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('로그인이 필요합니다.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    for (const file of images) {
      formData.append('images', file);
    }
    try {
      await createPost(formData, token);
      setMsg('게시물 등록 완료!');
      setTitle('');
      setDescription('');
      setImages([]);
      if (onPostCreated) onPostCreated();
    } catch (e) {
      setMsg('등록 실패: ' + e.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목" required />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="설명" required />
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">게시물 등록</button>
      <div>{msg}</div>
    </form>
  );
}