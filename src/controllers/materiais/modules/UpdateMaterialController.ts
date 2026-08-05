import { Request, Response } from "express";
import { PropriedadeMaterial } from "@prisma/client";
import { UpdateMaterialService } from "../../../services/materiais/modules/UpdateMaterialService";

class UpdateMaterialController {

  async handle(req: Request, res: Response) {

    try {

      const { id } = req.params;

      const {

        propriedade,

        nome_material,

        qtde

      } = req.body;

      const service =
        new UpdateMaterialService();

      const material =
        await service.execute({

          id,

          propriedade:
            propriedade as PropriedadeMaterial,

          nome_material,

          qtde:
            qtde ? Number(qtde) : undefined

        });

      return res.json(material);

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

export { UpdateMaterialController };