import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const token = localStorage.getItem('token');
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #ccc' }}>
      <Link to="/">홈</Link>
      {token ? (
        <>
          <Link to="/profile" style={{ marginLeft: 16 }}>내 프로필</Link>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: 16 }}>로그인</Link>
          <Link to="/signup" style={{ marginLeft: 8 }}>회원가입</Link>
        </>
      )}
    </header>
  );
}