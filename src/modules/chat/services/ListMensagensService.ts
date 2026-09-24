import prismaClient from "../../../prisma";
import { getIO } from "../../../socket";

interface ListMensagensRequest {
  conversaId: string;
}

class ListMensagensService {
  async execute({
    conversaId,
  }: ListMensagensRequest) {
    const conversa =
      await prismaClient.conversa.findUnique({
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
          status: true,
        },
      });

    if (!conversa) {
      throw new Error(
        "Conversa não encontrada."
      );
    }

    /**
     * Marca como lidas todas as mensagens
     * recebidas que ainda não foram lidas.
     */
    const resultado =
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

    /**
     * Se alguma mensagem foi marcada como lida,
     * avisa todos os clientes conectados para que
     * a lista de conversas atualize o contador.
     */
    if (resultado.count > 0) {
      const io = getIO();

      io.emit("conversaAtualizada", {
        conversaId: conversa.id,
        ultimaMensagem:
          conversa.ultimaMensagem,
        ultimaData:
          conversa.ultimaData,
        status:
          conversa.status,
      });
    }

    /**
     * Busca novamente as mensagens depois
     * da atualização.
     */
    const mensagens =
      await prismaClient.mensagem.findMany({
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
