import { Request, Response } from "express";
import { ListMaterialService } from "../../../services/materiais/modules/ListMaterialService";

class ListMaterialController {

  async handle(req: Request, res: Response) {

    try {

      const service = new ListMaterialService();

      const materiais = await service.execute();

      return res.json(materiais);

    } catch (error) {

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Erro interno do servidor."
      });

    }

  }

}

export { ListMaterialController };