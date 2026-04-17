import Complaint from '../models/Complaint.js';
import { analyzeComplaint } from '../utils/aiHelper.js';

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const proofUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Run AI Analysis in background (don't block the user but use the result)
    const aiAnalysis = await analyzeComplaint(description);

    const complaint = new Complaint({
      user: req.user._id,
      title,
      description,
      category,
      priority: priority || 'Medium',
      proofUrl,
      aiSentiment: aiAnalysis.sentiment || 'Medium',
      aiTags: aiAnalysis.tags || [],
    });


    const createdComplaint = await complaint.save();
    const populated = await Complaint.findById(createdComplaint._id).populate('user', 'name email role department');

    if (req.io) {
      req.io.emit('new_complaint', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    console.error("Create Complaint Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.user = req.user._id;
    }
    const complaints = await Complaint.find(query)
      .populate('user', 'name email role department')
      .populate('messages.sender', 'name role')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email role department')
      .populate('messages.sender', 'name role');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Students can only view their own
    if (req.user.role === 'student' && complaint.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (status) complaint.status = status;

    const updatedComplaint = await complaint.save();
    const populated = await Complaint.findById(updatedComplaint._id)
      .populate('user', 'name email role department')
      .populate('messages.sender', 'name role');

    if (req.io) {
      req.io.emit('complaint_updated', populated);
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.messages.push({ sender: req.user._id, text });
    await complaint.save();

    const populated = await Complaint.findById(req.params.id)
      .populate('user', 'name email role department')
      .populate('messages.sender', 'name role');

    if (req.io) {
      req.io.to(`complaint_${complaint._id}`).emit('new_message', populated);
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
