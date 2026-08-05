import { Request, Response } from "express";
import { CreateMaterialService } from "../../../services/materiais/modules/CreateMaterialService";
import { PropriedadeMaterial } from "@prisma/client";

class CreateMaterialController {
  async handle(req: Request, res: Response) {
    try {
      const {
        id_curso,
        propriedade,
        nome_material,
        qtde,
      } = req.body;

      const createMaterialService = new CreateMaterialService();

      const material = await createMaterialService.execute({
        id_curso,
        propriedade: propriedade as PropriedadeMaterial,
        nome_material,
        qtde: qtde ? Number(qtde) : undefined,
      });

      return res.status(201).json(material);

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

export { CreateMaterialController };