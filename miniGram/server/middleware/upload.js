import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

export default multer({ storage });
