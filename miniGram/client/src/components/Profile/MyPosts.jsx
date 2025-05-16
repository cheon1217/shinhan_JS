import React, { useEffect, useState } from 'react';
import { fetchMyPosts } from '../../api/users';
import PostItem from '../Posts/PostItem';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMyPosts(token).then(res => setPosts(res.data));
    }
  }, []);
  return (
    <div>
      <h3>내가 올린 게시물</h3>
      {posts.length === 0 && <div>게시물이 없습니다.</div>}
      {posts.map(post => <PostItem key={post.id} post={post} />)}
    </div>
  );
}