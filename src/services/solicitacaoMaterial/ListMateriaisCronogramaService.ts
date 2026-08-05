import prismaClient from "../../prisma";

class ListMateriaisCronogramaService {

    async execute(id_cronograma: string) {

        const cronograma =
            await prismaClient.cronogramaCurso.findUnique({

                where: {
                    id: id_cronograma
                },

                include: {
                    detentoras: true
                }

            });

        if (!cronograma) {
            throw new Error("Cronograma não encontrado.");
        }

        if (!cronograma.detentoras) {
            throw new Error("Cronograma sem detentora.");
        }

        const materiais =
            await prismaClient.materiais.findMany({

                where: {

                    id_curso:
                        cronograma.detentoras.cursos_id

                },

                orderBy: {

                    nome_material: "asc"

                }

            });

        return materiais;

    }

}

export { ListMateriaisCronogramaService };