import { Request, Response } from "express";
import { ListServiceLicitacao } from "../../services/Licitacao/ListServiceLicitacao";

class ListLicitacaoController {
  async handle(req: Request, res: Response) {
    try {
      const listServiceLicitacao = new ListServiceLicitacao();
      const licitacoes = await listServiceLicitacao.execute();

      return res.status(200).json(licitacoes); // ✔ sempre retorna JSON válido
    } catch (error) {
      console.error("Erro ao listar licitações:", error);

      return res.status(500).json({
        error: true,
        message: "Erro ao listar licitações",
      });
    }
  }
}

export { ListLicitacaoController };