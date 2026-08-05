import { Request, Response } from "express";
import { CreateMatriculaService } from "../../../services/matricula/modules/CreateMatriculaService";

class CreateMatriculaController {

  async handle(req: Request, res: Response) {

    try {

      const {

        id_cronograma,
        id_aluno,

        confirmacao_curso,
        confirmacao_formatura,
        aprovado,

        justificativa

      } = req.body;

      const service = new CreateMatriculaService();

      const matricula = await service.execute({

        id_cronograma,
        id_aluno,

        confirmacao_curso,
        confirmacao_formatura,
        aprovado,

        justificativa

      });

      return res.status(201).json(matricula);

    } catch (error) {

      if (error instanceof Error) {

        return res.status(400).json({
          error: error.message
        });

      }

      return res.status(500).json({
        error: "Erro interno do servidor."
      });

    }

  }

}

export { CreateMatriculaController };