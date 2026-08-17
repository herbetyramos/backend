import { Request, Response } from "express";
import { CreateServiceCronograma } from "../../services/cronograma/CreateServiceCronograma";

class CreateCronogramaController {
  async handle(req: Request, res: Response) {
    try {
      const {
        bloco_id,
        detentoras_id,
        professor_id,
        local_id,
        sala_id,
        formatura_id,
        data_inicio,
        data_fim,
        hora_inicio,
        hora_fim,
        tema,
        is_status,
        especificacao,
        publicar,
        draft,
        quantidade_aluno,
        link_inscricao,
      } = req.body;

      // ======================================================
      // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
      // ======================================================

      const requiredFields = {
        local_id,
        sala_id,
        formatura_id,
        data_inicio,
        data_fim,
        hora_inicio,
        hora_fim,
        tema,
        is_status,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || value === "") {
          return res.status(400).json({
            error: `Campo obrigatório ausente: ${field}`,
          });
        }
      }

      // ======================================================
      // IMAGEM
      // ======================================================

      let imagem_url: string | null = null;

      if (req.file) {
        imagem_url = `/uploads/cronogramas/${req.file.filename}`;
      }

      console.log("=================================");
      console.log("CRIANDO CRONOGRAMA");
      console.log("Detentora:", detentoras_id);
      console.log("Saldo será verificado no service");
      console.log("Imagem:", imagem_url);
      console.log("=================================");

      // ======================================================
      // CRIAR CRONOGRAMA
      // ======================================================

      const service = new CreateServiceCronograma();

      const cronograma = await service.execute({
        bloco_id: bloco_id || null,

        detentoras_id: detentoras_id || null,

        professor_id: professor_id || null,

        local_id,
        sala_id,
        formatura_id,

        data_inicio,
        data_fim,

        hora_inicio,
        hora_fim,

        tema,
        is_status,

        especificacao: especificacao || null,

        publicar:
          publicar === true ||
          publicar === "true",

        draft:
          draft === true ||
          draft === "true",

        quantidade_aluno:
          quantidade_aluno !== undefined &&
          quantidade_aluno !== null &&
         quantidade_aluno !== ""
         ? String(quantidade_aluno)
         : undefined,

        link_inscricao:
          link_inscricao || null,

        imagem_url,
      });

      return res.json(cronograma);
    } catch (error: unknown) {
      console.error("=================================");
      console.error("ERRO AO CRIAR CRONOGRAMA:");
      console.error(error);
      console.error("=================================");

      const message =
        error instanceof Error
          ? error.message
          : "Erro ao criar cronograma.";

      return res.status(400).json({
        error: message,
      });
    }
  }
}

export {
  CreateCronogramaController,
};