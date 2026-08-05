import prismaClient from "../../prisma";

interface PlanejamentoRequest {
    planeja_id: string;
    dia: number;
    data_aula: Date;
    conteudo: string;
}

class CreatePlanejamentoService {

    async execute({
        planeja_id,
        dia,
        data_aula,
        conteudo
    }: PlanejamentoRequest) {

        const existe = await prismaClient.planejamentoAula.findFirst({
            where: {
                planeja_id,
                dia
            }
        });

        if (existe) {
            throw new Error("Planejamento deste dia já existe.");
        }

        const planejamento = await prismaClient.planejamentoAula.create({
            data: {
                planeja_id,
                dia,
                data_aula,
                conteudo
            }
        });

        return planejamento;
    }

}

export { CreatePlanejamentoService };