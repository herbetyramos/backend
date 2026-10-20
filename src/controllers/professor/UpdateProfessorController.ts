
import { Request, Response } from "express";
import { UpdateServiceProfessores } from "../../services/Professores/UpdateServiceProfessores";

class UpdateProfessorController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;

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

      if (
        !nome_professor ||
        !telefone ||
        !Endereco ||
        !bairro ||
        !Numero ||
        !contato ||
        !CPF ||
        !especialidade
      ) {
        return res.status(400).json({
          error: "Preencha todos os campos obrigatórios.",
        });
      }

      const foto = req.file?.filename;

      const service = new UpdateServiceProfessores();

      const professor = await service.execute({
        id,
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
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Professor não encontrado."
      ) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Erro ao atualizar professor:", error);

      return res.status(500).json({
        error: "Não foi possível atualizar o professor.",
      });
    }
  }
}

export { UpdateProfessorController };
