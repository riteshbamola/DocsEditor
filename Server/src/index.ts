// src/index.ts
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './db/db';
import dotenv from 'dotenv';
import DocumentRouter from './Routes/doc';
import Document from './Models/Document';
import { socketHandler } from './Routes/socket';
import UserRoutes from './Routes/user';
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const HttpServer = http.createServer(app);

// Enable JSON parsing



// Initialize Socket.IO with CORS enabled
const io = new Server(HttpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketHandler(io);
app.use(express.json());


app.use('/api', DocumentRouter);
app.use('/user', UserRoutes);

// Test route
app.get('/', (_req, res) => {
  res.send('Hello from Express + TypeScript + WebSocket');
});

// Start the server
HttpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
