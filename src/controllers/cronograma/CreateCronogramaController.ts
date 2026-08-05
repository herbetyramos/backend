import { Request, Response } from "express";
import { CreateServiceCronograma } from "../../services/cronograma/CreateServiceCronograma";

class CreateCronogramaController {
  async handle(req: Request, res: Response) {

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


    // ========== VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS ==========
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
      especificacao,
      quantidade_aluno,
      
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value === "") {
        return res
          .status(400)
          .json({ error: `Campo obrigatório ausente: ${field}` });
      }
    }
    // ========================================================


    const service = new CreateServiceCronograma();

    const cronograma = await service.execute({
      bloco_id: bloco_id || null,
      detentoras_id: detentoras_id || null,
      professor_id:professor_id || null,
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
      publicar: publicar ?? false,
      draft: draft ?? true,
      quantidade_aluno,
      link_inscricao: link_inscricao || null,
    });

    

    return res.json(cronograma);
  }
}

export { CreateCronogramaController };