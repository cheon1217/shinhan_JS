import React, { useState } from 'react';
import { login } from '../../api/auth';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      localStorage.setItem('token', res.data.token);
      setMsg('로그인 성공!');
      if (onLogin) onLogin();
    } catch (e) {
      setMsg('로그인 실패: ' + e.response?.data?.message);
    }
  };

  return (
    <div>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="이메일" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
      <div>{msg}</div>
    </div>
  );
}