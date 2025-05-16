import React, { useEffect, useState } from 'react';
import { fetchMe } from '../api/users';
import MyPosts from '../components/Profile/MyPosts';
import LikedPosts from '../components/Profile/LikedPosts';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe(token).then(res => setUser(res.data));
    }
  }, []);

  if (!user) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>내 프로필</h2>
      <div>
        <b>이메일:</b> {user.username}<br />
        <b>회원번호:</b> {user.id}
      </div>
      <MyPosts />
      <LikedPosts />
    </div>
  );
}