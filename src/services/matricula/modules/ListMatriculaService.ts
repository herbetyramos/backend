import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ListMatriculaService {

  async execute() {

    const matriculas = await prisma.matricula.findMany({

      include: {

        aluno: true,

        cronograma: {

          include: {

            bloco_curso: true,

            professor: true,

            localAula: true,

            salaAula: true,

            formatura: true

          }

        }

      },

      orderBy: [

        {
          cronograma: {
            data_inicio: "desc"
          }

        },

        {
          aluno: {
            nome: "asc"
          }

        }

      ]

    });

    return matriculas;

  }

}

export { ListMatriculaService };