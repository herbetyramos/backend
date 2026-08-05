import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();



export class DetailCronogramaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const cronograma = await prisma.cronogramaCurso.findUnique({
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