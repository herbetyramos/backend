import { Request, Response } from "express";

class UploadCronogramaImagemController {
  async handle(req: Request, res: Response) {
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

export { UploadCronogramaImagemController };