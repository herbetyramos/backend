import prismaClient from "../../prisma";



interface Request {

  id_cronograma: string;

  id_aluno: string;

  confirmacao_curso?: boolean;

  confirmacao_formatura?: boolean;

  aprovado?: boolean;

  justificativa?: string;

}



class CreateMatriculaService {


  async execute({

    id_cronograma,

    id_aluno,

    confirmacao_curso = false,

    confirmacao_formatura = false,

    aprovado = false,

    justificativa

  }: Request) {



    const matriculaExistente =
      await prismaClient.matricula.findFirst({

        where: {

          id_cronograma,

          id_aluno

        }

      });



    if (matriculaExistente) {

      throw new Error(
        "Aluno já matriculado nesta turma."
      );

    }



    const matricula =
      await prismaClient.matricula.create({

        data: {

          id_cronograma,

          id_aluno,

          confirmacao_curso,

          confirmacao_formatura,

          aprovado,

          justificativa

        },

        include: {

          aluno: true,

          cronograma: true

        }

      });



    return matricula;


  }


}


export {
  CreateMatriculaService
};