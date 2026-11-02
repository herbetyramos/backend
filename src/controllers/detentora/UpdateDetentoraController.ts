
import { Request, Response } from "express";
import { UpdateServiceDetentora } from "../../services/Detentora/UpdateServiceDetentora";

class UpdateDetentoraController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const {
      ata_id,
      cursos_id,
      quantidade_turma,
      valor_curso,
      ativo,
    } = req.body;

    const service = new UpdateServiceDetentora();

    const detentora = await service.execute({
      id,
      ata_id,
      cursos_id,
      quantidade_turma,
      valor_curso,
      ativo,
    });

    return res.json(detentora);
  }
}

export { UpdateDetentoraController };
