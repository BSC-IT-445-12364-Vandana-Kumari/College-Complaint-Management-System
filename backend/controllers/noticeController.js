import Notice from '../models/Notice.js';

export const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;

    const notice = new Notice({
      title,
      content,
      category: category || 'General',
      priority: priority || 'NORMAL',
      author: req.user._id,
    });

    const createdNotice = await notice.save();
    const populated = await Notice.findById(createdNotice._id).populate('author', 'name role');

    if (req.io) {
      req.io.emit('new_notice', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (notice.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notice.deleteOne();

    if (req.io) {
      req.io.emit('notice_deleted', req.params.id);
    }

    res.json({ message: 'Notice removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
