import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class FindAlunoCpfService {


  async execute(cpf: string) {


    const aluno = await prisma.aluno.findUnique({

      where: {
        CPF: cpf
      },

      include: {

        matriculas: {

          include: {

            cronograma: true

          }

        }

      }

    });



    if (!aluno) {

      throw new Error(
        "Aluno não encontrado"
      );

    }



    return aluno;


  }


}


export { FindAlunoCpfService };