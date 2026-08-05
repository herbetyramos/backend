import prismaClient from "../../prisma";

class ListSolicitacaoCronogramaService {

    async execute(id_cronograma: string) {

        const cronograma = await prismaClient.cronogramaCurso.findUnique({
            where: {
                id: id_cronograma
            },
            include: {
                professor: {
                    select: {
                        nome_professor: true
                    }
                },
                localAula: {
                    select: {
                        polo: true
                    }
                },
                salaAula: {
                    select: {
                        numero_sala: true
                    }
                },
                detentoras: {
                    include: {
                        ata: {
                            include: {
                                empresa: {
                                    select: {
                                        nome_empresa: true
                                    }
                                }
                            }
                        },
                        curso: {
                            select: {
                                nome_curso: true
                            }
                        }
                    }
                }
            }
        });

        if (!cronograma) {
            throw new Error("Cronograma não encontrado.");
        }

        const materiais = await prismaClient.solicitacaoMaterial.findMany({
            where: {
                id_cronograma
            },
            include: {
                material: true
            },
            orderBy: {
                created_at: "asc"
            }
        });

        return {
            cronograma,
            materiais,
            observacao:
                materiais.find(m => m.observacao)?.observacao ?? ""
        };
    }
}

export { ListSolicitacaoCronogramaService };