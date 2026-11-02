
import { Request, Response } from "express";
import { CreateServiceDetentora } from "../../services/Detentora/CreateServiceDetentora";

class CreateDetentoraController {
  async handle(req: Request, res: Response) {
    const {
      ata_id,
      cursos_id,
      quantidade_turma,
      valor_curso = 0,
      ativo = true,
    } = req.body;

    const createDetentoraService = new CreateServiceDetentora();

    const detentora = await createDetentoraService.execute({
      ata_id,
      cursos_id,
      quantidade_turma,
      valor_curso,
      ativo,
    });

    return res.json(detentora);
  }
}

export { CreateDetentoraController };
