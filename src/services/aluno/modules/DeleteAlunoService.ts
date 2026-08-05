import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class DeleteAlunoService {


  async execute(id: string) {


    const aluno = await prisma.aluno.findUnique({

      where: {
        id
      },

      include: {

        matriculas: true

      }

    });



    if (!aluno) {

      throw new Error(
        "Aluno não encontrado"
      );

    }



    // Evita apagar aluno que possui histórico

    if (aluno.matriculas.length > 0) {

      throw new Error(
        "Não é possível excluir aluno com matrícula cadastrada"
      );

    }



    const alunoExcluido = await prisma.aluno.delete({

      where: {
        id
      }

    });



    return alunoExcluido;


  }


}


export { DeleteAlunoService };