
import { Request, Response } from "express";

class UploadCronogramaController {
  async handle(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Nenhuma imagem foi enviada.",
        });
      }

      const baseUrl = `${req.protocol}://${req.get(
        "host"
      )}`;

      const imagem_url =
        `${baseUrl}/uploads/cronogramas/${req.file.filename}`;

      return res.status(201).json({
        imagem_url,
        arquivo: req.file.filename,
      });
    } catch (error: any) {
      console.error(
        "Erro ao fazer upload da imagem:",
        error
      );

      return res.status(500).json({
        error: "Erro ao fazer upload da imagem.",
      });
    }
  }
}

export { UploadCronogramaController };
