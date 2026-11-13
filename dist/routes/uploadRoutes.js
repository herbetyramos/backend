"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = require("express");
const multer_1 = require("../config/multer");
const uploadRoutes = (0, express_1.Router)();
exports.uploadRoutes = uploadRoutes;
// Upload de imagem do cronograma — mantém a rota existente.
uploadRoutes.post("/cronograma", multer_1.uploadCronograma.single("imagem"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "Nenhuma imagem foi enviada.",
        });
    }
    const imagemUrl = `/uploads/cronogramas/${req.file.filename}`;
    return res.json({
        imagem_url: imagemUrl,
        arquivo: req.file.filename,
    });
});
// Upload da lista de presença em PDF.
uploadRoutes.post("/lista-presenca", multer_1.uploadListaPresenca.single("arquivo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "Nenhum arquivo PDF foi enviado.",
        });
    }
    const listaPresencaUrl = `/uploads/cronogramas/${req.file.filename}`;
    return res.json({
        lista_presenca_url: listaPresencaUrl,
        arquivo: req.file.filename,
    });
});
