import express, {
  Request,
  Response,
  NextFunction,
} from "express";

import "express-async-errors";

import path from "path";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

import { router } from "./routes/routes";
import { matriculaRoutes } from "./routes/matricula";
import { uploadRoutes } from "./routes/uploadRoutes";
import { initSocket } from "./socket";

const app = express();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:4000",
  "http://192.168.15.84:4000",
  "http://192.168.15.84:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(
            `Origem não permitida pelo CORS: ${origin}`
          )
        );
      }
    },

    credentials: true,
  })
);

// ===============================
// JSON
// ===============================

app.use(express.json());

// ===============================
// ROTAS
// ===============================

app.use(router);

app.use(matriculaRoutes);

app.use("/upload", uploadRoutes);

// ===============================
// ARQUIVOS ESTÁTICOS
// ===============================

app.use(
  "/files",
  express.static(
    path.resolve(
      __dirname,
      "..",
      "tmp"
    )
  )
);

app.use(
  "/uploads",
  express.static(
    path.resolve(
      process.cwd(),
      "uploads"
    )
  )
);

// ===============================
// MIDDLEWARE DE ERRO
// ===============================

app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(
      "ERRO:",
      err
    );

    if (err instanceof Error) {
      return res.status(400).json({
        error: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message:
        "Internal server error",
    });
  }
);

// ===============================
// DEBUG
// ===============================

console.log(
  "USER:",
  process.env.EMAIL_USER
);

console.log(
  "PASS:",
  process.env.EMAIL_PASS
);

// ===============================
// SOCKET.IO
// ===============================

const server =
  http.createServer(app);

initSocket(server);

// ===============================
// SERVIDOR
// ===============================

const PORT =
  process.env.PORT || 3000;

server.listen(
  PORT,
  () => {
    console.log(
      `🚀 SERVIDOR RODANDO NA PORTA ${PORT}`
    );
  }
);