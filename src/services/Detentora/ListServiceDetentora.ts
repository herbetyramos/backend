import prismaClient from "../../prisma";

class ListServiceDetentora {
  async execute() {
    const detentora = await prismaClient.detentora.findMany({
      include: {
        curso: {
          select: {
            id: true,
            nome_curso: true,
            banner:true,
          },
        },
        ata: {
          select: {
            id: true,
            numero_ata: true,
          },
        },
      },
    });

    return detentora;
  }
}

export { ListServiceDetentora };