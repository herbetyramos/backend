
import { Router } from "express";
import {
  uploadCronograma,
  uploadListaPresenca,
} from "../config/multer";

const uploadRoutes = Router();

// Upload de imagem do cronograma — mantém a rota existente.
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

// Upload da lista de presença em PDF.
uploadRoutes.post(
  "/lista-presenca",
  uploadListaPresenca.single("arquivo"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "Nenhum arquivo PDF foi enviado.",
      });
    }

    const listaPresencaUrl =
      `/uploads/cronogramas/${req.file.filename}`;

    return res.json({
      lista_presenca_url: listaPresencaUrl,
      arquivo: req.file.filename,
    });
  }
);

export { uploadRoutes };
