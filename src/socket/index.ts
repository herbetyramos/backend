import { Server } from "socket.io";

let io: Server;

export function initSocket(server: any) {

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log("Cliente conectado:", socket.id);

        socket.on("join", (conversaId: string) => {
            socket.join(conversaId);
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
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