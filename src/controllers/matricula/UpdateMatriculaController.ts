import { Request, Response } from "express";
import prismaClient from "../../prisma";

export class UpdateMatriculaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const matricula = await prismaClient.matricula.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    });

    return res.json(matricula);
  }
}