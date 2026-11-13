
import prismaClient from "../../prisma";

class ListPlanejamentoService {
  async execute(planeja_id: string) {
    const planejamento = await prismaClient.planejamentoAula.findMany({
      where: {
        planeja_id,
      },
      include: {
        curso_programado: {
          select: {
            tema: true,
            data_inicio: true,
          },
        },
      },
      orderBy: {
        dia: "asc",
      },
    });

    return planejamento;
  }
}

export { ListPlanejamentoService };
