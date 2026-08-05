import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();


export class DeleteAlunoController  {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.aluno.delete({
      where: { id }
    });

    return res.json({
      message: "Excluído com sucesso"
    });
  }
}