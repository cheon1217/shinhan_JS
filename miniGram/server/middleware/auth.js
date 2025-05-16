import pkg from 'jsonwebtoken';
const { verify } = pkg;

export default (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '인증 필요' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ message: '토큰 오류' });
  }
};
