import prismaClient from "../../../prisma";
import { getIO } from "../../../socket";
import EnviarWhatsAppService from "../../../whatsapp/services/EnviarWhatsAppService";

interface EditarMensagemRequest {
  mensagemId: string;
  texto: string;
}

class EditarMensagemService {
  async execute({
    mensagemId,
    texto,
  }: EditarMensagemRequest) {
    const novoTexto = texto?.trim();

    if (!mensagemId) {
      throw new Error("Mensagem não informada.");
    }

    if (!novoTexto) {
      throw new Error(
        "O texto da mensagem não pode ser vazio."
      );
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
        "Somente mensagens enviadas pelo sistema podem ser editadas."
      );
    }

    if (mensagem.apagada) {
      throw new Error(
        "Não é possível editar uma mensagem apagada."
      );
    }

    if (!mensagem.whatsappId) {
      throw new Error(
        "A mensagem ainda não possui ID do WhatsApp."
      );
    }

    if (mensagem.tipo !== "TEXTO") {
      throw new Error(
        "Neste momento, somente mensagens de texto podem ser editadas."
      );
    }

    await EnviarWhatsAppService.editarMensagem(
      mensagem.conversa.telefone,
      mensagem.whatsappId,
      novoTexto
    );

    const mensagemAtualizada =
      await prismaClient.mensagem.update({
        where: {
          id: mensagem.id,
        },
        data: {
          texto: novoTexto,
          editada: true,
        },
      });

    await prismaClient.conversa.update({
      where: {
        id: mensagem.conversaId,
      },
      data: {
        ultimaMensagem: novoTexto,
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

export { EditarMensagemService };