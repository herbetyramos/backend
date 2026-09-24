import prismaClient from "../../../prisma";
import { getIO } from "../../../socket";

interface AtualizarStatusConversaRequest {
  conversaId: string;
  status:
    | "AGUARDANDO_ATENDIMENTO"
    | "EM_ATENDIMENTO"
    | "FINALIZADO";
}

class AtualizarStatusConversaService {
  async execute({
    conversaId,
    status,
  }: AtualizarStatusConversaRequest) {
    const conversa = await prismaClient.conversa.findUnique({
      where: {
        id: conversaId,
      },
    });

    if (!conversa) {
      throw new Error("Conversa não encontrada.");
    }

    const conversaAtualizada =
      await prismaClient.conversa.update({
        where: {
          id: conversaId,
        },
        data: {
          status,
        },
      });

    const io = getIO();

    io.to(conversaId).emit(
      "statusConversaAtualizado",
      {
        conversaId: conversaAtualizada.id,
        status: conversaAtualizada.status,
      }
    );

    io.emit("conversaAtualizada", {
      conversaId: conversaAtualizada.id,
      status: conversaAtualizada.status,
      ultimaMensagem: conversaAtualizada.ultimaMensagem,
      ultimaData: conversaAtualizada.ultimaData,
    });

    return conversaAtualizada;
  }
}

export { AtualizarStatusConversaService };
