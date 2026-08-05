import prismaClient from "../../../prisma";


class ListAlunosCronogramaService {

  async execute(id: string) {


    const cronograma =
      await prismaClient.cronogramaCurso.findUnique({

        where: {
          id,
        },

        include: {

          matriculas: {

            include: {

              aluno: true,

            },

          },

        },

      });


    if (!cronograma) {

      throw new Error(
        "Cronograma não encontrado."
      );

    }


    return {

      alunos:
        cronograma.matriculas.map(
          (item) => ({

            id: item.aluno.id,

            nome: item.aluno.nome,

            telefone:
              item.aluno.celular,

          })
        ),

    };

  }

}


export {
  ListAlunosCronogramaService
};