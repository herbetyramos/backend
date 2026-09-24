import fs from "fs/promises";
import path from "path";

import prismaClient from "../../../prisma";
import { getIO } from "../../../socket";

import EnviarWhatsAppService from "../../../whatsapp/services/EnviarWhatsAppService";

interface EnviarMensagemRequest {
  conversaId: string;
  texto?: string;

  arquivo?: Buffer;
  mimeType?: string;
  nomeArquivo?: string;
  tamanho?: number;
}

class EnviarMensagemService {
  async execute({
    conversaId,
    texto,
    arquivo,
    mimeType,
    nomeArquivo,
    tamanho,
  }: EnviarMensagemRequest) {
    const textoLimpo =
      texto?.trim() || "";

    const possuiArquivo =
      !!arquivo && arquivo.length > 0;

    /*
     * Não permite mensagem completamente vazia.
     */
    if (
      !textoLimpo &&
      !possuiArquivo
    ) {
      throw new Error(
        "A mensagem não pode ser vazia."
      );
    }

    /*
     * Busca a conversa.
     */
    const conversa =
      await prismaClient.conversa.findUnique({
        where: {
          id: conversaId,
        },
      });

    if (!conversa) {
      throw new Error(
        "Conversa não encontrada."
      );
    }

    /*
     * Dados do arquivo.
     */
    let tipo = "TEXTO";
    let nomeArquivoFinal:
      | string
      | null = null;

    let mimeTypeFinal:
      | string
      | null = null;

    let tamanhoFinal:
      | number
      | null = null;

    let arquivoUrl:
      | string
      | null = null;

    /*
     * Texto que será mostrado na conversa
     * quando existir um arquivo.
     */
    let textoFinal = textoLimpo;

    /*
     * Processa o arquivo.
     */
    if (possuiArquivo) {
      if (!mimeType) {
        throw new Error(
          "Tipo MIME do arquivo não informado."
        );
      }

      if (!nomeArquivo) {
        throw new Error(
          "Nome do arquivo não informado."
        );
      }

      const mime =
        mimeType.toLowerCase();

      /*
       * Define o tipo da mensagem.
       */
      if (mime.startsWith("image/")) {
        tipo = "IMAGEM";
      } else if (
        mime.startsWith("video/")
      ) {
        tipo = "VIDEO";
      } else if (
        mime.startsWith("audio/")
      ) {
        tipo = "AUDIO";
      } else {
        tipo = "DOCUMENTO";
      }

      nomeArquivoFinal =
        nomeArquivo;

      mimeTypeFinal =
        mimeType;

      tamanhoFinal =
        tamanho ??
        arquivo.length;

      /*
       * Cria a pasta:
       *
       * backend/uploads/chat
       */
      const uploadsPath =
        path.resolve(
          process.cwd(),
          "uploads",
          "chat"
        );

      await fs.mkdir(
        uploadsPath,
        {
          recursive: true,
        }
      );

      /*
       * Remove caracteres problemáticos
       * do nome original.
       */
      const nomeSeguro =
        nomeArquivo
          .replace(
            /[<>:"/\\|?*\x00-\x1F]/g,
            "_"
          )
          .trim();

      /*
       * Evita colisão entre arquivos.
       */
      const nomeFinal =
        `${Date.now()}-${nomeSeguro}`;

      const caminhoArquivo =
        path.join(
          uploadsPath,
          nomeFinal
        );

      /*
       * Salva o arquivo no servidor.
       */
      await fs.writeFile(
        caminhoArquivo,
        arquivo
      );

      /*
       * URL pública usada pelo frontend.
       */
      arquivoUrl =
        `/uploads/chat/${encodeURIComponent(
          nomeFinal
        )}`;

      /*
       * Se não houver texto/caption,
       * cria uma descrição automática.
       */
      if (!textoFinal) {
        if (tipo === "IMAGEM") {
          textoFinal =
            `📷 ${nomeArquivo}`;
        } else if (
          tipo === "VIDEO"
        ) {
          textoFinal =
            `🎥 ${nomeArquivo}`;
        } else if (
          tipo === "AUDIO"
        ) {
          textoFinal =
            "🎵 Áudio";
        } else {
          textoFinal =
            `📄 ${nomeArquivo}`;
        }
      }
    }

    /*
     * Cria a mensagem no banco.
     */
    let mensagem =
      await prismaClient.mensagem.create({
        data: {
          conversaId,

          texto: textoFinal,

          tipo,

          nomeArquivo:
            nomeArquivoFinal,

          mimeType:
            mimeTypeFinal,

          tamanho:
            tamanhoFinal,

          arquivoUrl,

          enviado: true,

          lida: false,

          status: "PENDING",
        },
      });

    /*
     * Atualiza a última mensagem da conversa.
     */
    await prismaClient.conversa.update({
      where: {
        id: conversaId,
      },

      data: {
        ultimaMensagem:
          textoFinal,

        ultimaData:
          mensagem.created_at,
      },
    });

    /*
     * Socket.IO
     */
    const io = getIO();

    io.to(conversaId).emit(
      "novaMensagem",
      mensagem
    );

    io.emit(
      "atualizarConversas"
    );

    /*
     * Envia para o WhatsApp.
     */
    if (conversa.telefone) {
      try {
        const respostaWhatsApp =
          await EnviarWhatsAppService.execute(
            conversa.telefone,
            textoLimpo || undefined,
            arquivo,
            mimeType,
            nomeArquivo
          );

        console.log(
          "Mensagem enviada ao WhatsApp:",
          respostaWhatsApp
        );

        /*
         * ID da mensagem no WhatsApp.
         */
        const whatsappId =
          respostaWhatsApp?.key?.id;

        /*
         * Atualiza status.
         */
        mensagem =
          await prismaClient.mensagem.update({
            where: {
              id: mensagem.id,
            },

            data: {
              whatsappId:
                whatsappId ?? null,

              status: "SENT",
            },
          });

        io.to(conversaId).emit(
          "mensagemAtualizada",
          mensagem
        );
      } catch (error) {
        console.error(
          "Erro ao enviar mensagem para o WhatsApp:",
          error
        );

        /*
         * Se o envio falhar,
         * mantém a mensagem no banco,
         * mas marca como FAILED.
         */
        mensagem =
          await prismaClient.mensagem.update({
            where: {
              id: mensagem.id,
            },

            data: {
              status: "FAILED",
            },
          });

        io.to(conversaId).emit(
          "mensagemAtualizada",
          mensagem
        );
      }
    }

    return mensagem;
  }
}

export {
  EnviarMensagemService,
};