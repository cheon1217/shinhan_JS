import React, { useState } from 'react';
import { sendCode } from '../../api/auth';

export default function EmailCodeForm({ onCodeSent }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSend = async () => {
    try {
      await sendCode(email);
      setMsg('인증코드가 이메일로 전송되었습니다.');
      if (onCodeSent) onCodeSent(email);
    } catch (e) {
      setMsg('전송 실패: ' + e.response?.data?.message);
    }
  };

  return (
    <div>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" />
      <button onClick={handleSend}>인증코드 받기</button>
      <div>{msg}</div>
    </div>
  );
}