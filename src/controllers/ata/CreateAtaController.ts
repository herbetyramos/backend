import { Request, Response } from "express";
import { CreateServiceAta } from "../../services/Ata/CreateServiceAta";

class CreateAtaController {
  async handle(req: Request, res: Response) {
    try {
      const { numero_ata, licitacao_id, id_empresa } = req.body;

      // -------------------------------
      // VALIDAR CAMPOS OBRIGATÓRIOS
      // -------------------------------
      if (!numero_ata || !licitacao_id || !id_empresa) {
        return res.status(400).json({
          error: true,
          message: "Preencha todos os campos obrigatórios.",
        });
      }

      const service = new CreateServiceAta();

      const ata = await service.execute({
        numero_ata,
        licitacao_id,
        id_empresa
      });

      return res.status(201).json(ata); // criado com sucesso
    } catch (error) {
      console.error("Erro ao criar ata:", error);

      return res.status(500).json({
        error: true,
        message: "Erro ao criar ata.",
      });
    }
  }
}

export { CreateAtaController };