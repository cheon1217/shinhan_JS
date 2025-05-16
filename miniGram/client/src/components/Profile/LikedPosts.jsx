import React, { useEffect, useState } from 'react';
import { fetchLikedPosts } from '../../api/users';
import PostItem from '../Posts/PostItem';

export default function LikedPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchLikedPosts(token).then(res => setPosts(res.data));
    }
  }, []);
  return (
    <div>
      <h3>좋아요 누른 게시물</h3>
      {posts.length === 0 && <div>게시물이 없습니다.</div>}
      {posts.map(post => <PostItem key={post.id} post={post} />)}
    </div>
  );
}