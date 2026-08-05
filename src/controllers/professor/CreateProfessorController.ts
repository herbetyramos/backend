import { Request, Response } from "express";
import { CreateServiceProfessores } from "../../services/Professores/CreateServiceProfessores";

class CreateProfessorController {
  async handle(req: Request, res: Response) {

    const {
      nome_professor,
      telefone,
      Endereco,
      bairro,
      Numero,
      contato,
      CPF,
      especialidade,
    } = req.body;

    const foto = req.file?.filename || null;

    const createProfessorService = new CreateServiceProfessores();

    const professor = await createProfessorService.execute({
      nome_professor,
      telefone,
      Endereco,
      bairro,
      Numero,
      contato,
      CPF,
      especialidade,
      foto,
    });

    return res.json(professor);
  }
}

export { CreateProfessorController };