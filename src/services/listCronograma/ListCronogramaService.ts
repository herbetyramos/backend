import prismaClient from "../../prisma";

export class ListCronogramaService {
  async execute() {
    const cronogramas =
      await prismaClient.cronogramaCurso.findMany({
        orderBy: {
          codigo: "asc",
        },

        include: {
          bloco_curso: true,

          localAula: true,

          salaAula: true,

          professor: {
            select: {
              id: true,
              nome_professor: true,
              telefone: true,
              especialidade: true,
              foto: true,
            },
          },

          formatura: true,

          detentoras: {
            include: {
              ata: {
                include: {
                  empresa: true,
                },
              },

              curso: {
                include: {
                  segmento: true,
                },
              },
            },
          },

          _count: {
            select: {
              matriculas: true,
            },
          },
        },
      });

    const resultado =
      await Promise.all(
        cronogramas.map(
          async (cronograma) => {
            const {
              _count,
              ...dadosCronograma
            } = cronograma;

            // ==========================================
            // SEM DETENTORA
            // ==========================================

            if (!cronograma.detentoras) {
              return {
                ...dadosCronograma,

                quantidadeAlunos:
                  _count.matriculas,

                saldoDetentora: null,
              };
            }

            // ==========================================
            // QUANTIDADE CONTRATADA
            // ==========================================

            const contratado =
              cronograma.detentoras
                .quantidade_turma ?? 0;

            // ==========================================
            // TURMAS UTILIZADAS
            //
            // CANCELADOS NÃO CONSUMEM SALDO
            //
            // O cronograma CANCELADO continua aparecendo
            // no ListCronograma, mas não entra nesta conta.
            // ==========================================

            const utilizadas =
              await prismaClient.cronogramaCurso.count({
                where: {
                  detentoras_id:
                    cronograma.detentoras.id,

                is_status: {
                  not: "CANCELADO",
                    },
                },
              });

            // ==========================================
            // SALDO
            // ==========================================

            const saldo =
              contratado - utilizadas;

            // ==========================================
            // RETORNO
            // ==========================================

            return {
              ...dadosCronograma,

              quantidadeAlunos:
                _count.matriculas,

              saldoDetentora: {
                empresa:
                  cronograma.detentoras.ata
                    ?.empresa
                    ?.nome_empresa ?? "",

                ata:
                  cronograma.detentoras.ata
                    ?.numero_ata ?? "",

                curso:
                  cronograma.detentoras.curso
                    ?.nome_curso ?? "",

                contratado,

                utilizadas,

                saldo,
              },
            };
          }
        )
      );

    return resultado;
  }
}