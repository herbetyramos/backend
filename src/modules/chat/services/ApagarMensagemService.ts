import prismaClient from "../../../prisma";
import { getIO } from "../../../socket";
import EnviarWhatsAppService from "../../../whatsapp/services/EnviarWhatsAppService";

interface ApagarMensagemRequest {
  mensagemId: string;
}

class ApagarMensagemService {
  async execute({
    mensagemId,
  }: ApagarMensagemRequest) {
    if (!mensagemId) {
      throw new Error("Mensagem não informada.");
    }

    const mensagem =
      await prismaClient.mensagem.findUnique({
        where: {
          id: mensagemId,
        },
        include: {
          conversa: true,
        },
      });

    if (!mensagem) {
      throw new Error("Mensagem não encontrada.");
    }

    if (!mensagem.enviado) {
      throw new Error(
        "Somente mensagens enviadas pelo sistema podem ser apagadas."
      );
    }

    if (mensagem.apagada) {
      throw new Error(
        "A mensagem já foi apagada."
      );
    }

    if (!mensagem.whatsappId) {
      throw new Error(
        "A mensagem ainda não possui ID do WhatsApp."
      );
    }

    await EnviarWhatsAppService.apagarMensagem(
      mensagem.conversa.telefone,
      mensagem.whatsappId
    );

    const mensagemAtualizada =
      await prismaClient.mensagem.update({
        where: {
          id: mensagem.id,
        },
        data: {
          texto: "Mensagem apagada",
          apagada: true,
        },
      });

    await prismaClient.conversa.update({
      where: {
        id: mensagem.conversaId,
      },
      data: {
        ultimaMensagem: "Mensagem apagada",
        ultimaData: mensagemAtualizada.created_at,
      },
    });

    const io = getIO();

    io.to(mensagem.conversaId).emit(
      "mensagemAtualizada",
      mensagemAtualizada
    );

    io.emit("atualizarConversas");

    return mensagemAtualizada;
  }
}

export { ApagarMensagemService };