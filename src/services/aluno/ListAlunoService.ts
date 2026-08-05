import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class ListAlunoService {


  async execute() {


    const alunos = await prisma.aluno.findMany({

      orderBy: {

        nome: "asc"

      },

      include: {

        matriculas: true

      }

    });


    return alunos;


  }


}


export { ListAlunoService };