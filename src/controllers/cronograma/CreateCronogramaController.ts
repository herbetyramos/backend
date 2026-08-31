
import { Request, Response } from "express";
import { CreateServiceCronograma } from "../../services/cronograma/CreateServiceCronograma";

class CreateCronogramaController {
  async handle(req: Request, res: Response) {
    try {
      // ======================================================
      // DADOS RECEBIDOS
      // ======================================================

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
        imagem_url,
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
      //
      // O frontend faz primeiro:
      //
      // POST /upload/cronograma
      //
      // e recebe:
      //
      // /uploads/cronogramas/arquivo.png
      //
      // Depois envia essa URL no POST /cronograma.
      //
      // Também mantemos suporte para req.file caso
      // futuramente o próprio /cronograma receba multipart.
      // ======================================================

      let imagemUrlFinal: string | null = null;

      // ------------------------------------------------------
      // IMAGEM ENVIADA COMO URL PELO FRONTEND
      // ------------------------------------------------------

      if (
        typeof imagem_url === "string" &&
        imagem_url.trim() !== ""
      ) {
        imagemUrlFinal = imagem_url.trim();
      }

      // ------------------------------------------------------
      // IMAGEM ENVIADA DIRETAMENTE COMO ARQUIVO
      // ------------------------------------------------------

      if (req.file) {
        imagemUrlFinal =
          `/uploads/cronogramas/${req.file.filename}`;
      }

      // ======================================================
      // LOG
      // ======================================================

      console.log("=================================");
      console.log("CRIANDO CRONOGRAMA");
      console.log("Detentora:", detentoras_id);
      console.log("Saldo será verificado no service");
      console.log("Imagem recebida:", imagem_url);
      console.log("Imagem final:", imagemUrlFinal);
      console.log("=================================");

      // ======================================================
      // CRIAR CRONOGRAMA
      // ======================================================

      const service = new CreateServiceCronograma();

      const cronograma = await service.execute({
        // ----------------------------------------------------
        // RELACIONAMENTOS
        // ----------------------------------------------------

        bloco_id: bloco_id || null,

        detentoras_id:
          detentoras_id || null,

        professor_id:
          professor_id || null,

        local_id,

        sala_id,

        formatura_id,

        // ----------------------------------------------------
        // DATAS
        // ----------------------------------------------------

        data_inicio,

        data_fim,

        // ----------------------------------------------------
        // HORÁRIOS
        // ----------------------------------------------------

        hora_inicio,

        hora_fim,

        // ----------------------------------------------------
        // DADOS DO CRONOGRAMA
        // ----------------------------------------------------

        tema,

        is_status,

        especificacao:
          especificacao || null,

        // ----------------------------------------------------
        // PUBLICAÇÃO
        // ----------------------------------------------------

        publicar:
          publicar === true ||
          publicar === "true",

        draft:
          draft === true ||
          draft === "true",

        // ----------------------------------------------------
        // QUANTIDADE DE ALUNOS
        // ----------------------------------------------------

        quantidade_aluno:
          quantidade_aluno !== undefined &&
          quantidade_aluno !== null &&
          quantidade_aluno !== ""
            ? String(quantidade_aluno)
            : undefined,

        // ----------------------------------------------------
        // LINK DE INSCRIÇÃO
        // ----------------------------------------------------

        link_inscricao:
          typeof link_inscricao === "string" &&
          link_inscricao.trim() !== ""
            ? link_inscricao.trim()
            : null,

        // ----------------------------------------------------
        // IMAGEM
        // ----------------------------------------------------

        imagem_url: imagemUrlFinal,
      });

      // ======================================================
      // RESPOSTA
      // ======================================================

      console.log("=================================");
      console.log("CRONOGRAMA CRIADO COM SUCESSO");
      console.log("ID:", cronograma?.id);
      console.log("Imagem:", cronograma?.imagem_url);
      console.log("=================================");

      return res.json(cronograma);
    } catch (error: unknown) {
      // ======================================================
      // TRATAMENTO DE ERRO
      // ======================================================

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
