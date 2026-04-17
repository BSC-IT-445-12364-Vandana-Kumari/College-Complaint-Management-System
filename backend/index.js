import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dns from 'dns';

// Force use of Google DNS if local DNS fails to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded evidence images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();


// Setup socket.io
io.on('connection', (socket) => {
  console.log('User connected via socket:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Pass IO instance to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

import aiRoutes from './routes/aiRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/ai', aiRoutes);


app.get('/', (req, res) => {
  res.send('CIMAGE Complaint & Notice System API running...');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
