import axios from 'axios';

// 게시물 목록 조회
export const fetchPosts = () =>
  axios.get('/api/posts');

// 게시물 상세 조회
export const fetchPost = (postId) =>
  axios.get(`/api/posts/${postId}`);

// 게시물 등록 (이미지 여러 개)
export const createPost = (formData, token) =>
  axios.post('/api/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

// 게시물 수정
export const updatePost = (postId, data, token) =>
  axios.put(`/api/posts/${postId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 게시물 삭제
export const deletePost = (postId, token) =>
  axios.delete(`/api/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });