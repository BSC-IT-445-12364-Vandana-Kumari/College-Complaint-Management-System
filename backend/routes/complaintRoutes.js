import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addMessage,
} from '../controllers/complaintController.js';
import { protect, teacherOrAdmin } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.route('/').post(protect, upload.single('evidence'), createComplaint).get(protect, getComplaints);
router.route('/:id').get(protect, getComplaintById);
router.route('/:id/status').patch(protect, teacherOrAdmin, updateComplaintStatus);
router.route('/:id/message').post(protect, addMessage);

export default router;
