import { Request, Response } from "express";
import { ListMaterialCursoService } from "../../../services/materiais/modules/ListMaterialCursoService";

class ListMaterialCursoController {

  async handle(req: Request, res: Response) {

    try {

      const { id_curso } = req.params;

      const service = new ListMaterialCursoService();

      const materiais = await service.execute(id_curso);

      return res.json(materiais);

    } catch (error) {

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });

    }

  }

}

export { ListMaterialCursoController };