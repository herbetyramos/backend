import prismaClient from "../../prisma";


class GetSaldoDetentoraService {


    async execute(id: string) {


        const detentora = await prismaClient.detentora.findUnique({

            where: {
                id
            },

            include: {

                curso: {
                    select: {

                        id: true,
                        nome_curso: true

                    }
                },

                ata: {

                    include: {

                        empresa: {

                            select: {

                                nome_empresa: true

                            }

                        }

                    }

                }

            }

        });



        if (!detentora) {

            throw new Error(
                "Detentora não encontrada."
            );

        }



        const utilizadas =
            await prismaClient.cronogramaCurso.count({
                where: {
                detentoras_id: id,
                is_status: {
                 not: "CANCELADO",
                },
                },
            });



        const contratado =
            detentora.quantidade_turma ?? 0;



        return {


            id: detentora.id,


            empresa:
                detentora.ata?.empresa?.nome_empresa ?? "-",


            ata:
                detentora.ata?.numero_ata ?? "-",


            curso:
                detentora.curso.nome_curso,


            contratado,


            utilizadas,


            saldo:
                contratado - utilizadas


        };


    }

}


export { GetSaldoDetentoraService };