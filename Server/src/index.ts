// src/index.ts
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './db/db';
import dotenv from 'dotenv';
import DocumentRouter from './Routes/doc';
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const HttpServer = http.createServer(app);

// Enable JSON parsing
app.use(express.json());


// Initialize Socket.IO with CORS enabled
const io = new Server(HttpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // Handle join document event
  socket.on('JOIN_DOCUMENT', ({ docId, userId }) => {
    console.log(`User ${userId} joined doc ${docId}`);
    socket.join(`doc:${docId}`);

    // Broadcast to everyone in the room except the sender
    socket.to(`doc:${docId}`).emit("USER_JOINED", {
      userId,
      message: `👋 User ${userId} has joined the document.`,
    });
  });

  // Handle document content updates
  socket.on('UPDATE_DOC_CONTENT', ({ docId, content }) => {
    socket.to(`doc:${docId}`).emit('DOC_UPDATED', content);
  });

  // Optional: handle disconnects
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

app.use('/api', DocumentRouter);
// Test route
app.get('/', (_req, res) => {
  res.send('Hello from Express + TypeScript + WebSocket');
});

// Start the server
HttpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
