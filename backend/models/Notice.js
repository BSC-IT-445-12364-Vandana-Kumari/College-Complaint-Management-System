import mongoose from 'mongoose';

const noticeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Facilities', 'Events', 'General'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'NORMAL',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
