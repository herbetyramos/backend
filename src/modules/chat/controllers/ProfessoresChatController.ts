
import { Request, Response } from "express";

import {
  EnviarMensagemProfessoresService,
} from "../services/EnviarMensagemProfessoresService";

class ProfessoresChatController {
  private service = new EnviarMensagemProfessoresService();

  async listar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const professores =
        await this.service.listarProfessores(id);

      return res.status(200).json({
        total: professores.length,
        professores,
      });
    } catch (error) {
      console.error(
        "Erro ao listar professores do bloco:",
        error
      );

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao listar professores.",
      });
    }
  }

  async enviar(req: Request, res: Response) {
    try {
      const cronogramaId = req.body.cronogramaId;
      const texto = req.body.texto;
      const professoresIdsRaw: unknown =
        req.body.professoresIds;

      if (
        typeof cronogramaId !== "string" ||
        !cronogramaId.trim()
      ) {
        return res.status(400).json({
          error: "Cronograma não informado.",
        });
      }

      let professoresIds: string[] = [];

      if (typeof professoresIdsRaw === "string") {
        try {
          const parsed: unknown = JSON.parse(
            professoresIdsRaw
          );

          if (Array.isArray(parsed)) {
            professoresIds = parsed.filter(
              (id): id is string =>
                typeof id === "string" && id.trim().length > 0
            );
          }
        } catch {
          return res.status(400).json({
            error: "Lista de professores inválida.",
          });
        }
      } else if (Array.isArray(professoresIdsRaw)) {
        professoresIds = professoresIdsRaw.filter(
          (id): id is string =>
            typeof id === "string" && id.trim().length > 0
        );
      }

      const arquivo = req.file;

      const resultado = await this.service.enviar({
        cronogramaId,
        professoresIds,
        texto:
          typeof texto === "string" ? texto : "",
        arquivo: arquivo?.buffer,
        mimeType: arquivo?.mimetype,
        nomeArquivo: arquivo?.originalname,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem aos professores:",
        error
      );

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao enviar mensagem aos professores.",
      });
    }
  }
}

export { ProfessoresChatController };
