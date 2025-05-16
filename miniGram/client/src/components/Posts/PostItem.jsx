import React from 'react';

export default function PostItem({ post }) {
  const images = JSON.parse(post.imageUrl || '[]');
  return (
    <div style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
      <div>
        {images.map((url, i) => (
          <img key={i} src={url} alt="" style={{ width: 100, marginRight: 4 }} />
        ))}
      </div>
      <div>
        <b>{post.title}</b>
        <p>{post.description}</p>
      </div>
    </div>
  );
}