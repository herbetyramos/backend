import prismaClient from "../../prisma";

class ListAtaServices {
  async execute() {
    const ata = await prismaClient.ata.findMany({
      select: {
        id: true,
        numero_ata: true,
        licitacao_id: true,
        id_empresa: true,
        empresa: {
          select: {
            nome_empresa: true,
          },
        },
      },
      orderBy: {
        numero_ata: "asc",
      },
    });

    return ata;
  }
}

export { ListAtaServices };