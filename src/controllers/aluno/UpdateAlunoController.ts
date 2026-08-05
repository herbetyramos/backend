import { Request, Response } from "express";
import prismaClient from "../../prisma";

export class UpdateAlunoController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const aluno = await prismaClient.aluno.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    });

    return res.json(aluno);
  }
}