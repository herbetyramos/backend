import { Request, Response } from "express";
import { ListServiceEmpresa } from "../../services/empresa/ListServiceEmpresa";

class ListEmpresaController {
  async handle(req: Request, res: Response) {
    try {
      const listServiceEmpresa = new ListServiceEmpresa();
      const empresas = await listServiceEmpresa.execute();

      return res.status(200).json(empresas); // ✔ sempre retorna JSON
    } catch (error) {
      console.error("Erro ao listar empresas:", error);

      return res.status(500).json({
        error: true,
        message: "Erro ao listar empresas",
      });
    }
  }
}

export { ListEmpresaController };