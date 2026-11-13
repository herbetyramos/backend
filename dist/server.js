"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routes_1 = require("./routes/routes");
const matricula_1 = require("./routes/matricula");
const uploadRoutes_1 = require("./routes/uploadRoutes");
const socket_1 = require("./socket");
const WhatsAppClient_1 = require("./whatsapp/client/WhatsAppClient");
const app = (0, express_1.default)();
// ===============================
// CORS
// ===============================
const allowedOrigins = [
    "https://gestaom.com",
    "https://www.gestaom.com",
    "http://localhost:4000",
    "http://192.168.15.84:4000",
    "http://192.168.15.84:3001",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permite requisições sem Origin
        // (Postman, curl, chamadas internas etc.)
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.error(`Origem não permitida pelo CORS: ${origin}`);
        return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    credentials: true,
}));
// ===============================
// JSON
// ===============================
app.use(express_1.default.json());
// ===============================
// ROTAS
// ===============================
app.use(routes_1.router);
app.use(matricula_1.matriculaRoutes);
app.use("/upload", uploadRoutes_1.uploadRoutes);
// ===============================
// ARQUIVOS ESTÁTICOS
// ===============================
app.use("/files", express_1.default.static(path_1.default.resolve(__dirname, "..", "tmp")));
app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "uploads")));
// ===============================
// MIDDLEWARE DE ERRO
// ===============================
app.use((err, req, res, next) => {
    console.error("ERRO:", err);
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});
// ===============================
// DEBUG
// ===============================
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);
// ===============================
// SERVIDOR HTTP + SOCKET.IO
// ===============================
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
// ===============================
// SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
    console.log(`🔌 Socket.IO disponível na porta ${PORT}`);
    // ===============================
    // WHATSAPP
    // ===============================
    WhatsAppClient_1.whatsappClient
        .iniciar()
        .catch((error) => {
        console.error("❌ Erro ao iniciar WhatsApp:", error);
    });
});
