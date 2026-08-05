import prismaClient from "../../../prisma";

interface ListConversasRequest {
  busca?: string;
}

class ListConversasService {
  async execute({ busca }: ListConversasRequest) {
    const conversas = await prismaClient.conversa.findMany({
      where: busca
        ? {
            OR: [
              {
                nome: {
                  contains: busca,
                  mode: "insensitive",
                },
              },
              {
                telefone: {
                  contains: busca,
                },
              },
            ],
          }
        : undefined,

      include: {
        _count: {
          select: {
            mensagens: {
              where: {
                enviado: false,
                lida: false,
              },
            },
          },
        },
      },

      orderBy: [
        {
          ultimaData: "desc",
        },
      ],
    });

        return conversas.map((conversa) => ({
      id: conversa.id,
      telefone: conversa.telefone,
      nome: conversa.nome,
      ultimaMensagem: conversa.ultimaMensagem,
      ultimaData: conversa.ultimaData,
      naoLidas: conversa._count.mensagens,
    }));
      }
}

export { ListConversasService };