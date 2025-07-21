import { Server, Socket } from "socket.io";
import Document from "../Models/Document";
interface ClientToServerEvents {
  joinDocument: (docId: string, userId: string) => void;
  // getDocument: (docId: string) => void;
  sendChanges: (data: { docId: string; content: string }) => void;
  saveDocument: (data: { docId: string; content: string }) => void;
}
interface ServerToClientEvents {
  // loadDocument: (content: string) => void;
  receiveChanges: (content: string) => void;
}
export const socketHandler = (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on('joinDocument', (docId, userId) => {
      console.log(`${userId} joined the Document ${docId}`);
      socket.join(`doc:${docId}`);
    });
    socket.on('saveDocument', async ({ docId, content }) => {
      try {
        const docs = await Document.findByIdAndUpdate(docId, { content });
        console.log("Changes Saved Successfully");

      } catch (err: any) {
        console.log("Error Saving Changes", err.message);
      }
    })
    socket.on('sendChanges', ({ docId, content }) => {
      console.log(`Received changes for document ${docId}`);
      socket.to(`doc:${docId}`).emit("receiveChanges", content);
    })




  });

};
