import { Request, Response } from "express";
import { DeleteMaterialService } from "../../../services/materiais/modules/DeleteMaterialService";

class DeleteMaterialController {

  async handle(req: Request, res: Response) {

    try {

      const { id } = req.params;

      const service =
        new DeleteMaterialService();

      const retorno =
        await service.execute(id);

      return res.json(retorno);

    } catch (error) {

      if (error instanceof Error) {

        return res.status(400).json({

          error: error.message

        });

      }

      return res.status(500).json({

        error: "Erro interno."

      });

    }

  }

}

export { DeleteMaterialController };