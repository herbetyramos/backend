import { Request, Response } from "express";
import { ListServiceFormatura } from "../../services/formatura/ListServiceFormatura";

class ListFormaturaController {
  async handle(req: Request, res: Response) {
    try {
      const listServiceFormatura = new ListServiceFormatura();
      const formatura = await listServiceFormatura.execute();

      return res.status(200).json(formatura); // ✔ sempre retorna JSON
    } catch (error) {
      console.error("Erro ao listar formatura:", error);

      return res.status(500).json({
        error: true,
        message: "Erro ao listar formatura",
      });
    }
  }
}

export { ListFormaturaController };