"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCronogramaImagemController = void 0;
class UploadCronogramaImagemController {
    async handle(req, res) {
        if (!req.file) {
            return res.status(400).json({
                error: "Nenhuma imagem foi enviada.",
            });
        }
        const imagem_url = `/uploads/cronogramas/${req.file.filename}`;
        return res.status(200).json({
            imagem_url,
            filename: req.file.filename,
        });
    }
}
exports.UploadCronogramaImagemController = UploadCronogramaImagemController;
