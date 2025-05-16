import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPost } from '../api/posts';
import HashtagList from '../components/Hashtags/HashtagList';
import ReviewList from '../components/Reviews/ReviewList';
import LikeButton from '../components/Likes/LikeButton';

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost(postId).then(res => setPost(res.data));
  }, [postId]);

  if (!post) return <div>로딩 중...</div>;

  const images = JSON.parse(post.imageUrl || '[]');

  return (
    <div>
      <h2>{post.title}</h2>
      <div>
        {images.map((url, i) => (
          <img key={i} src={url} alt="" style={{ width: 150, marginRight: 8 }} />
        ))}
      </div>
      <p>{post.description}</p>
      <HashtagList postId={post.id} />
      <LikeButton postId={post.id} />
      <ReviewList postId={post.id} />
    </div>
  );
}