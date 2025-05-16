import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../../api/posts';
import PostItem from './PostItem';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}