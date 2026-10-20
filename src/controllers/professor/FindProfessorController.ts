
import { Request, Response } from "express";
import { FindServiceProfessores } from "../../services/Professores/FindServiceProfessores";

class FindProfessorController {
  async handle(req: Request, res: Response) {
    try {
      const professor = await new FindServiceProfessores().execute(
        req.params.id
      );

      return res.json(professor);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Professor não encontrado."
      ) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Erro ao consultar professor:", error);

      return res.status(500).json({
        error: "Não foi possível consultar o professor.",
      });
    }
  }
}

export { FindProfessorController };
