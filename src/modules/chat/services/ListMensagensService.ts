import prismaClient from "../../../prisma";

interface ListMensagensRequest {
  conversaId: string;
}

class ListMensagensService {
  async execute({
    conversaId,
  }: ListMensagensRequest) {

    const conversa = await prismaClient.conversa.findUnique({
      where: {
        id: conversaId,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        aluno_id: true,
        professor_id: true,
        ultimaMensagem: true,
        ultimaData: true,
      },
    });

    if (!conversa) {
      throw new Error("Conversa não encontrada.");
    }

    await prismaClient.mensagem.updateMany({
      where: {
        conversaId,
        enviado: false,
        lida: false,
      },
      data: {
        lida: true,
      },
    });

    const mensagens = await prismaClient.mensagem.findMany({
      where: {
        conversaId,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return {
      conversa,
      mensagens,
    };
  }
}

export { ListMensagensService };