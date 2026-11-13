"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadListaPresenca = exports.uploadCronograma = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.resolve(process.cwd(), "uploads", "cronogramas");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const extensao = path_1.default.extname(file.originalname);
        const nomeOriginal = path_1.default
            .basename(file.originalname, extensao)
            .replace(/[^a-zA-Z0-9-_]/g, "-");
        cb(null, `${Date.now()}-${nomeOriginal}${extensao.toLowerCase()}`);
    },
});
const imageFileFilter = (_req, file, cb) => {
    const extensoesPermitidas = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    ];
    const extensao = path_1.default
        .extname(file.originalname)
        .toLowerCase();
    if (!extensoesPermitidas.includes(extensao)) {
        return cb(new Error("Formato de imagem não permitido. Use JPG, JPEG, PNG ou WEBP."));
    }
    cb(null, true);
};
const pdfFileFilter = (_req, file, cb) => {
    const extensao = path_1.default
        .extname(file.originalname)
        .toLowerCase();
    if (extensao !== ".pdf" ||
        file.mimetype !== "application/pdf") {
        return cb(new Error("Arquivo inválido. Selecione um documento PDF."));
    }
    cb(null, true);
};
// Upload de fotos: mantém o limite original de 5 MB.
exports.uploadCronograma = (0, multer_1.default)({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
});
// Upload da lista de presença: limite de 10 MB.
exports.uploadListaPresenca = (0, multer_1.default)({
    storage,
    fileFilter: pdfFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});
