import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateMatriculaRequest {
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
    justificativa,
    

  }: CreateMatriculaRequest) {

    // Verifica Cronograma

    const cronograma =
      await prisma.cronogramaCurso.findUnique({

        where: {
          id: id_cronograma
        }

      });

    if (!cronograma) {

      throw new Error(
        "Cronograma não encontrado."
      );

    }


    // Verifica Aluno

    const aluno =
      await prisma.aluno.findUnique({

        where: {
          id: id_aluno
        }

      });

    if (!aluno) {

      throw new Error(
        "Aluno não encontrado."
      );

    }


    // Evita matrícula duplicada

    const matriculaExiste =
      await prisma.matricula.findFirst({

        where: {

          id_cronograma,

          id_aluno

        }

      });

    if (matriculaExiste) {

      throw new Error(
        "Aluno já matriculado neste cronograma."
      );

    }


    // Salva matrícula

    const matricula =
      await prisma.matricula.create({

        data: {

          id_cronograma,

          id_aluno,

          confirmacao_curso,

          confirmacao_formatura,

          aprovado,

          justificativa,

          

        }

      });

    return matricula;

  }

}

export { CreateMatriculaService };