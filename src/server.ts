import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import path from "path";
import cors from "cors";
import http from "http";

import dotenv from "dotenv";
dotenv.config();

import { router } from "./routes/routes";
import { matriculaRoutes } from "./routes/matricula";
import { initSocket } from "./socket"; // <-- novo

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

// JSON
app.use(express.json());

// Rotas
app.use(router);
app.use(matriculaRoutes);

// Arquivos estáticos
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp"))
);

// Middleware de erro
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof Error) {
      return res.status(400).json({
        error: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

// Debug
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

// ===============================
// SOCKET.IO
// ===============================

const server = http.createServer(app);

initSocket(server);

// ===============================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
});