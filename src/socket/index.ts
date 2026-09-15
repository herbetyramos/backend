
import { Server } from "socket.io";

let io: Server;

const allowedOrigins = [
  "https://gestaom.com",
  "https://www.gestaom.com",
  "http://localhost:4000",
  "http://192.168.15.84:4000",
  "http://192.168.15.84:3001",
];

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Cliente Socket.IO conectado:", socket.id);

    socket.on("join", (conversaId: string) => {
      if (!conversaId) {
        return;
      }

      socket.join(conversaId);

      console.log(
        `Socket ${socket.id} entrou na conversa ${conversaId}`
      );
    });

    socket.on("leave", (conversaId: string) => {
      if (!conversaId) {
        return;
      }

      socket.leave(conversaId);

      console.log(
        `Socket ${socket.id} saiu da conversa ${conversaId}`
      );
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `Cliente Socket.IO desconectado: ${socket.id}`,
        reason
      );
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO não inicializado");
  }

  return io;
}
