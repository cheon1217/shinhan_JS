import { Router } from 'express';
import nodemailer from 'nodemailer';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prepare } from '../db/init';

const router = Router();
const emailCodes = new Map(); // {email: {code, expires}}

const transporter = nodemailer.createTransport({
  service: 'naver',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. 인증코드 발송
router.post('/send-code', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  emailCodes.set(email, { code, expires: Date.now() + 5 * 60 * 1000 }); // 5분 유효

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: '미니그램 인증코드',
    text: `인증코드: ${code}`
  });

  res.json({ message: '인증코드 발송됨' });
});

// 2. 인증코드 검증 및 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, code } = req.body;
  const saved = emailCodes.get(email);
  if (!saved || saved.code !== code || saved.expires < Date.now())
    return res.status(400).json({ message: '인증코드 오류' });

  const hashed = await hash(password, 10);
  try {
    prepare(`INSERT INTO users (username, password) VALUES (?, ?)`).run(email, hashed);
    emailCodes.delete(email);
    res.json({ message: '회원가입 완료' });
  } catch {
    res.status(400).json({ message: '이미 존재하는 유저명' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = prepare(`SELECT * FROM users WHERE username = ?`).get(username);
  if (!user || !(await compare(password, user.password)))
    return res.status(401).json({ message: '로그인 실패' });

  const token = sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;
