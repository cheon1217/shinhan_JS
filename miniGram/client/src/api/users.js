import axios from 'axios';

export const fetchMe = (token) =>
  axios.get('/api/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchMyPosts = (token) =>
  axios.get('/api/users/me/posts', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchLikedPosts = (token) =>
  axios.get('/api/users/me/liked-posts', {
    headers: { Authorization: `Bearer ${token}` },
  });