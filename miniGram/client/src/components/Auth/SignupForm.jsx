import React, { useState } from 'react';
import { sendCode, signup } from '../../api/auth';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSendCode = async () => {
    try {
      await sendCode(email);
      setCodeSent(true);
      setMsg('이메일로 인증코드를 보냈습니다.');
    } catch (e) {
      setMsg('인증코드 발송 실패: ' + e.response?.data?.message);
    }
  };

  const handleSignup = async () => {
    try {
      await signup(email, password, code);
      setMsg('회원가입 완료! 로그인 해주세요.');
    } catch (e) {
      setMsg('회원가입 실패: ' + e.response?.data?.message);
    }
  };

  return (
    <div>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" />
      <button onClick={handleSendCode}>인증코드 받기</button>
      {codeSent && (
        <>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="인증코드" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" />
          <button onClick={handleSignup}>회원가입</button>
        </>
      )}
      <div>{msg}</div>
    </div>
  );
}