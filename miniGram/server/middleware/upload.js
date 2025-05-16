import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });
export const multi = upload.array('images', 10); // 최대 10개까지 허용
export default upload;
