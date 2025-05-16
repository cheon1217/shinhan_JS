import React, { useEffect, useState } from 'react';
import { fetchHashtags } from '../../api/hashtags';

export default function HashtagList({ postId }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (postId) {
      fetchHashtags(postId).then(res => setTags(res.data.tags));
    }
  }, [postId]);

  return (
    <div>
      {tags.map(tag => (
        <span key={tag} style={{ marginRight: 8, color: '#1976d2' }}>#{tag}</span>
      ))}
    </div>
  );
}