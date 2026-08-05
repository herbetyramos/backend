import { Request, Response } from "express";
import prismaClient from "../../prisma";

export class UpdateCronogramaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const cronograma = await prismaClient.cronogramaCurso.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    });

    return res.json(cronograma);
  }
}