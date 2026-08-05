import prismaClient from "../../prisma";
import { getIO } from "../../socket";
import { WebhookBody } from "../types";

class ReceberWhatsAppService {

  private async buscarOuCriarConversa(
    telefone: string,
    nome: string,
    ultimaMensagem: string
  ) {
    let conversa = await prismaClient.conversa.findFirst({
  where: {
    telefone,
  },
});

    if (!conversa) {
      conversa = await prismaClient.conversa.create({
        data: {
          telefone,
          nome,
          ultimaMensagem,
          ultimaData: new Date(),
        },
      });

      return conversa;
    }

    if (conversa.nome !== nome) {
      conversa = await prismaClient.conversa.update({
        where: {
          id: conversa.id,
        },
        data: {
          nome,
        },
      });
    }

    return conversa;
  }

  private async salvarMensagem(
    conversaId: string,
    texto: string
  ) {
    return prismaClient.mensagem.create({
      data: {
        conversaId,
        texto,
        enviado: false,
        lida: false,
      },
    });
  }

  private async atualizarConversa(
    conversaId: string,
    texto: string
  ) {
    return prismaClient.conversa.update({
      where: {
        id: conversaId,
      },
      data: {
        ultimaMensagem: texto,
        ultimaData: new Date(),
      },
    });
  }

  async execute(body: WebhookBody) {

    const io = getIO();

    for (const entry of body.entry) {

      for (const change of entry.changes) {

        const mensagens = change.value.messages;

        if (!mensagens) {
          continue;
        }

        for (const mensagem of mensagens) {

          // Ignora mensagens sem texto
          if (mensagem.type !== "text") {
            continue;
          }

          const telefone = mensagem.from;

          const nome =
            change.value.contacts?.[0]?.profile?.name || telefone;

          const texto =
            mensagem.text?.body?.trim() || "";

          if (!texto) {
            continue;
          }

          const conversa = await this.buscarOuCriarConversa(
            telefone,
            nome,
            texto
          );

          const novaMensagem = await this.salvarMensagem(
            conversa.id,
            texto
          );

          await this.atualizarConversa(
            conversa.id,
            texto
          );

          io.emit("novaMensagem", novaMensagem);

          io.emit("conversaAtualizada", {
            conversaId: conversa.id,
            ultimaMensagem: texto,
            ultimaData: new Date(),
          });

          console.log("Mensagem recebida:", texto);
        }
      }
    }
  }
}

export default new ReceberWhatsAppService();