import express from 'express';
import {
  createNotice,
  getNotices,
  deleteNotice,
} from '../controllers/noticeController.js';
import { protect, teacherOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, teacherOrAdmin, createNotice).get(protect, getNotices);
router.route('/:id').delete(protect, teacherOrAdmin, deleteNotice);

export default router;
