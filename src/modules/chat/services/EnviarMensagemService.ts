import prismaClient from "../../../prisma";
import { getIO } from "../../../socket";
import EnviarWhatsAppService from "../../../whatsapp/services/EnviarWhatsAppService";

interface EnviarMensagemRequest {
  conversaId: string;
  texto: string;
}

class EnviarMensagemService {
  async execute({
    conversaId,
    texto,
  }: EnviarMensagemRequest) {

    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      throw new Error("A mensagem não pode ser vazia.");
    }

    const conversa = await prismaClient.conversa.findUnique({
      where: {
        id: conversaId,
      },
    });

    if (!conversa) {
      throw new Error("Conversa não encontrada.");
    }

    const mensagem = await prismaClient.mensagem.create({
      data: {
        conversaId,
        texto: textoLimpo,
        enviado: true,
        lida: false,
      },
    });

    await prismaClient.conversa.update({
      where: {
        id: conversaId,
      },
      data: {
        ultimaMensagem: textoLimpo,
        ultimaData: mensagem.created_at,
      },
    });

    const io = getIO();

    // Atualiza quem está com a conversa aberta
    io.to(conversaId).emit("novaMensagem", mensagem);

    // Atualiza a lista lateral
    io.emit("atualizarConversas");

    // Envia para o WhatsApp
    if (conversa.telefone) {
      try {
        const respostaWhatsApp =
          await EnviarWhatsAppService.execute(
            conversa.telefone,
            textoLimpo
          );

        console.log(
          "Mensagem enviada ao WhatsApp:",
          respostaWhatsApp
        );

        // Futuramente salvaremos aqui o whatsappId retornado pela Meta.
      } catch (error) {
        console.error(
          "Erro ao enviar mensagem para o WhatsApp:",
          error
        );
      }
    }

    return mensagem;
  }
}

export { EnviarMensagemService };