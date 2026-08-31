import { Router } from "express";
import { uploadCronograma } from "../config/multer";

const uploadRoutes = Router();

uploadRoutes.post(
  "/cronograma",
  uploadCronograma.single("imagem"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "Nenhuma imagem foi enviada.",
      });
    }

    const imagemUrl =
      `/uploads/cronogramas/${req.file.filename}`;

    return res.json({
      imagem_url: imagemUrl,
      arquivo: req.file.filename,
    });
  }
);

export { uploadRoutes };