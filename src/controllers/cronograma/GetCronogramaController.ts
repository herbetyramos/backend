import { Request, Response } from "express";
import prismaClient from "../../prisma";

export class GetCronogramaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const cronograma = await prismaClient.cronogramaCurso.findUnique({
      where: { id },
      include: {
        professor: true,
        localAula: true,
        salaAula: true,
        formatura: true,
        bloco_curso: true,
      },
    });

    return res.json(cronograma);
  }
}