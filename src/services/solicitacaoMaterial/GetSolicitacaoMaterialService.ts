import prismaClient from "../../prisma";

class GetMateriaisCronogramaService {

    async execute(id_cronograma: string) {

        const cronograma = await prismaClient.cronogramaCurso.findUnique({
            where: {
                id: id_cronograma
            },
            include: {
                detentoras: {
                    include: {
                        curso: true
                    }
                }
            }
        });

        if (!cronograma) {
            throw new Error("Cronograma não encontrado.");
        }

        const materiais = await prismaClient.materiais.findMany({
            where: {
                id_curso: cronograma.detentoras?.cursos_id
            },
            orderBy: {
                nome_material: "asc"
            }
        });

        return {
            cronograma,
            materiais
        };
    }

}

export { GetMateriaisCronogramaService };