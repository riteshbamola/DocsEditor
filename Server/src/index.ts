import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3000;
const HttpServer= http.createServer(app);
app.use(express.json());

const io = new Server(HttpServer,{
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
})

io.on('connection',(socket)=>{
  console.log(`Socket connectioned ${socket.id}`);

    socket.on('JOIN_DOCUMENT', ({ docId, userId }) => {
    console.log(`User ${userId} joined doc ${docId}`);
    socket.join(`doc:${docId}`);

    socket.to(`doc:${docId}`).emit("USER_JOINED", {
    userId,
    message: `👋 User ${userId} has joined the document.`,
  });
  });
   socket.on('UPDATE_DOC_CONTENT', ({ docId, content }) => {
    socket.to(`doc:${docId}`).emit('DOC_UPDATED', content);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
})

app.get('/', (_req, res) => {
  res.send('Hello from Express + TypeScript + WebSocket');
});



HttpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
