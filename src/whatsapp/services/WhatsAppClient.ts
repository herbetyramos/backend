import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  WAMessageContent,
  normalizeMessageContent,
  downloadMediaMessage,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

import ReceberWhatsAppService from "../services/ReceberWhatsAppService";

class WhatsAppClient {
  private sock: WASocket | null = null;

  private qrCode: string | null = null;

  private conectado = false;

  private inicializando = false;

  private authPath = path.resolve(
    process.cwd(),
    "whatsapp_auth"
  );

  private uploadsPath = path.resolve(
    process.cwd(),
    "uploads",
    "chat"
  );

  /**
   * ==================================================
   * INICIALIZAR WHATSAPP
   * ==================================================
   */
  async iniciar() {
    if (this.inicializando) {
      console.log(
        "WhatsApp já está inicializando..."
      );

      return;
    }

    this.inicializando = true;

    try {
      fs.mkdirSync(
        this.authPath,
        {
          recursive: true,
        }
      );

      fs.mkdirSync(
        this.uploadsPath,
        {
          recursive: true,
        }
      );

      const {
        state,
        saveCreds,
      } =
        await useMultiFileAuthState(
          this.authPath
        );

      const sock =
        makeWASocket({
          auth: state,

          browser: [
            "GestaoM",
            "Chrome",
            "1.0.0",
          ],

          printQRInTerminal: false,

          syncFullHistory: false,

          markOnlineOnConnect: false,
        });

      this.sock = sock;

      /**
       * ==================================================
       * SALVAR CREDENCIAIS
       * ==================================================
       */
      sock.ev.on(
        "creds.update",
        saveCreds
      );

      /**
       * ==================================================
       * ATUALIZAÇÃO DA CONEXÃO
       * ==================================================
       */
      sock.ev.on(
        "connection.update",
        async (update) => {
          const {
            connection,
            lastDisconnect,
            qr,
          } = update;

          /**
           * QR CODE
           */
          if (qr) {
            try {
              this.qrCode =
                await QRCode.toDataURL(
                  qr
                );

              console.log(
                "📱 Novo QR Code disponível."
              );
            } catch (error) {
              console.error(
                "Erro ao gerar QR Code:",
                error
              );
            }
          }

          /**
           * CONECTADO
           */
          if (
            connection ===
            "open"
          ) {
            this.conectado =
              true;

            this.qrCode = null;

            console.log(
              "✅ WhatsApp conectado."
            );
          }

          /**
           * DESCONECTADO
           */
          if (
            connection ===
            "close"
          ) {
            this.conectado =
              false;

            const statusCode =
              (
                lastDisconnect
                  ?.error as Boom
              )?.output
                ?.statusCode;

            const deveReconectar =
              statusCode !==
              DisconnectReason.loggedOut;

            console.log(
              "❌ WhatsApp desconectado.",
              {
                statusCode,
                deveReconectar,
              }
            );

            this.sock = null;

            if (
              deveReconectar
            ) {
              console.log(
                "🔄 Reconectando WhatsApp..."
              );

              setTimeout(
                () => {
                  this.inicializando =
                    false;

                  this.iniciar();
                },
                3000
              );

              return;
            }

            console.log(
              "⚠️ WhatsApp foi desconectado definitivamente."
            );

            this.inicializando =
              false;
          }
        }
      );

      /**
       * ==================================================
       * RECEBIMENTO DE MENSAGENS
       * ==================================================
       */
      sock.ev.on(
        "messages.upsert",
        async ({
          messages,
          type,
        }) => {
          if (
            type !== "notify"
          ) {
            return;
          }

          for (const message of messages) {
            try {
              /**
               * Ignora mensagens enviadas
               * pelo próprio WhatsApp.
               */
              if (
                message.key.fromMe
              ) {
                continue;
              }

              /**
               * Ignora mensagens de status.
               */
              if (
                message.key.remoteJid ===
                "status@broadcast"
              ) {
                continue;
              }

              /**
               * Ignora grupos.
               */
              if (
                message.key.remoteJid?.endsWith(
                  "@g.us"
                )
              ) {
                continue;
              }

              let remoteJid =
                message.key.remoteJid;

              if (!remoteJid) {
                continue;
              }

              /**
               * ==================================================
               * CONVERSÃO DE LID PARA NÚMERO
               * ==================================================
               */
              if (
                remoteJid.endsWith(
                  "@lid"
                )
              ) {
                try {
                  const lid =
                    remoteJid;

                  const pn =
                    await sock
                      .signalRepository
                      .lidMapping
                      .getPNForLID(
                        lid
                      );

                  if (pn) {
                    console.log(
                      "WhatsApp: LID convertido para PN"
                    );

                    console.log(
                      "LID recebido:",
                      lid
                    );

                    console.log(
                      "Número convertido:",
                      pn
                    );

                    remoteJid =
                      pn;
                  }
                } catch (error) {
                  console.error(
                    "Erro ao converter LID:",
                    error
                  );
                }
              }

              /**
               * ==================================================
               * NÚMERO DO TELEFONE
               * ==================================================
               */
              const telefone =
                remoteJid
                  .replace(
                    "@s.whatsapp.net",
                    ""
                  )
                  .replace(
                    /\D/g,
                    ""
                  );

              if (!telefone) {
                console.log(
                  "⚠️ Telefone não identificado."
                );

                continue;
              }

              /**
               * ==================================================
               * NORMALIZA CONTEÚDO
               * ==================================================
               */
              const conteudo =
                normalizeMessageContent(
                  message.message
                );

              if (!conteudo) {
                continue;
              }

              /**
               * ==================================================
               * NOME DO CONTATO
               * ==================================================
               */
              const nome =
                message.pushName ||
                telefone;

              let texto = "";

              let tipo =
                "TEXTO";

              let nomeArquivo:
                | string
                | undefined;

              let mimeType:
                | string
                | undefined;

              let tamanho:
                | number
                | undefined;

              let arquivoUrl:
                | string
                | undefined;

              /**
               * ==================================================
               * TEXTO
               * ==================================================
               */
              if (
                conteudo.conversation
              ) {
                texto =
                  conteudo.conversation;

                tipo =
                  "TEXTO";
              }

              /**
               * ==================================================
               * TEXTO DE CONTEXTO
               * ==================================================
               */
              else if (
                conteudo
                  .extendedTextMessage
                  ?.text
              ) {
                texto =
                  conteudo
                    .extendedTextMessage
                    .text;

                tipo =
                  "TEXTO";
              }

              /**
               * ==================================================
               * IMAGEM
               * ==================================================
               */
              else if (
                conteudo.imageMessage
              ) {
                const imagem =
                  conteudo.imageMessage;

                tipo =
                  "IMAGEM";

                mimeType =
                  imagem.mimetype ||
                  "image/jpeg";

                nomeArquivo =
                  `${Date.now()}.jpg`;

                texto =
                  imagem.caption?.trim() ||
                  "📷 Imagem";

                console.log(
                  "📥 Recebendo imagem..."
                );

                const buffer =
                  await downloadMediaMessage(
                    message,
                    "buffer",
                    {}
                  );

                tamanho =
                  buffer.length;

                const caminho =
                  path.join(
                    this.uploadsPath,
                    nomeArquivo
                  );

                fs.writeFileSync(
                  caminho,
                  buffer
                );

                arquivoUrl =
                  `/uploads/chat/${encodeURIComponent(
                    nomeArquivo
                  )}`;

                console.log(
                  "Imagem salva:",
                  caminho
                );
              }

              /**
               * ==================================================
               * DOCUMENTO
               * ==================================================
               */
              else if (
                conteudo.documentMessage
              ) {
                const documento =
                  conteudo.documentMessage;

                tipo =
                  "DOCUMENTO";

                mimeType =
                  documento.mimetype ||
                  "application/octet-stream";

                nomeArquivo =
                  documento.fileName ||
                  `${Date.now()}-documento`;

                texto =
                  documento.caption?.trim() ||
                  `📄 ${nomeArquivo}`;

                console.log(
                  "📥 Recebendo documento..."
                );

                const buffer =
                  await downloadMediaMessage(
                    message,
                    "buffer",
                    {}
                  );

                tamanho =
                  buffer.length;

                const nomeSeguro =
                  `${Date.now()}-${nomeArquivo}`;

                const caminho =
                  path.join(
                    this.uploadsPath,
                    nomeSeguro
                  );

                fs.writeFileSync(
                  caminho,
                  buffer
                );

                nomeArquivo =
                  nomeSeguro;

                arquivoUrl =
                  `/uploads/chat/${encodeURIComponent(
                    nomeArquivo
                  )}`;

                console.log(
                  "Documento salvo:",
                  caminho
                );
              }

              /**
               * ==================================================
               * ÁUDIO
               * ==================================================
               */
              else if (
                conteudo.audioMessage
              ) {
                const audio =
                  conteudo.audioMessage;

                tipo =
                  "AUDIO";

                mimeType =
                  audio.mimetype ||
                  "audio/ogg";

                const extensao =
                  mimeType.includes(
                    "mpeg"
                  )
                    ? "mp3"
                    : "ogg";

                nomeArquivo =
                  `${Date.now()}.${extensao}`;

                texto =
                  "🎵 Áudio";

                console.log(
                  "📥 Recebendo áudio..."
                );

                const buffer =
                  await downloadMediaMessage(
                    message,
                    "buffer",
                    {}
                  );

                tamanho =
                  buffer.length;

                const caminho =
                  path.join(
                    this.uploadsPath,
                    nomeArquivo
                  );

                fs.writeFileSync(
                  caminho,
                  buffer
                );

                arquivoUrl =
                  `/uploads/chat/${encodeURIComponent(
                    nomeArquivo
                  )}`;

                console.log(
                  "Áudio salvo:",
                  caminho
                );
              }

              /**
               * ==================================================
               * VÍDEO
               * ==================================================
               */
              else if (
                conteudo.videoMessage
              ) {
                const video =
                  conteudo.videoMessage;

                tipo =
                  "VIDEO";

                mimeType =
                  video.mimetype ||
                  "video/mp4";

                nomeArquivo =
                  `${Date.now()}.mp4`;

                texto =
                  video.caption?.trim() ||
                  "🎥 Vídeo";

                console.log(
                  "📥 Recebendo vídeo..."
                );

                const buffer =
                  await downloadMediaMessage(
                    message,
                    "buffer",
                    {}
                  );

                tamanho =
                  buffer.length;

                const caminho =
                  path.join(
                    this.uploadsPath,
                    nomeArquivo
                  );

                fs.writeFileSync(
                  caminho,
                  buffer
                );

                arquivoUrl =
                  `/uploads/chat/${encodeURIComponent(
                    nomeArquivo
                  )}`;

                console.log(
                  "Vídeo salvo:",
                  caminho
                );
              }

              /**
               * ==================================================
               * OUTRO TIPO DE ARQUIVO
               * ==================================================
               */
              else {
                tipo =
                  "ARQUIVO";

                texto =
                  "📎 Arquivo";

                console.log(
                  "⚠️ Tipo de mensagem não tratado:"
                );

                console.log(
                  Object.keys(
                    conteudo
                  )
                );
              }

              /**
               * ==================================================
               * ENVIA PARA O SERVICE
               * ==================================================
               */
              await ReceberWhatsAppService.execute(
                {
                  telefone,
                  nome,
                  texto,
                  tipo,
                  nomeArquivo,
                  mimeType,
                  tamanho,
                  arquivoUrl,
                  whatsappId:
                    message.key.id ||
                    null,
                }
              );

              console.log(
                "=========================================="
              );

              console.log(
                "WhatsApp: mensagem recebida"
              );

              console.log(
                "Telefone:",
                telefone
              );

              console.log(
                "Nome:",
                nome
              );

              console.log(
                "Tipo:",
                tipo
              );

              console.log(
                "Texto:",
                texto
              );

              if (
                nomeArquivo
              ) {
                console.log(
                  "Arquivo:",
                  nomeArquivo
                );
              }

              if (
                mimeType
              ) {
                console.log(
                  "MIME:",
                  mimeType
                );
              }

              if (
                tamanho
              ) {
                console.log(
                  "Tamanho:",
                  tamanho
                );
              }

              if (
                arquivoUrl
              ) {
                console.log(
                  "URL:",
                  arquivoUrl
                );
              }

              console.log(
                "WhatsApp ID:",
                message.key.id
              );

              console.log(
                "=========================================="
              );
            } catch (error) {
              console.error(
                "❌ Erro ao processar mensagem recebida:",
                error
              );
            }
          }
        }
      );
    } catch (error) {
      console.error(
        "❌ Erro ao inicializar WhatsApp:",
        error
      );

      this.sock = null;

      this.conectado =
        false;

      this.inicializando =
        false;
    }
  }

  /**
   * ==================================================
   * ENVIAR TEXTO
   * ==================================================
   */
  async enviarTexto(
    telefone: string,
    texto: string
  ) {
    if (!this.sock) {
      throw new Error(
        "WhatsApp não está inicializado."
      );
    }

    if (!this.conectado) {
      throw new Error(
        "WhatsApp não está conectado."
      );
    }

    if (!texto?.trim()) {
      throw new Error(
        "Texto da mensagem não informado."
      );
    }

    const numero =
      telefone.replace(
        /\D/g,
        ""
      );

    if (!numero) {
      throw new Error(
        "Número de telefone inválido."
      );
    }

    const jid =
      `${numero}@s.whatsapp.net`;

    console.log(
      "📤 GestãoM → WhatsApp: enviando texto",
      {
        telefone: numero,
        texto,
      }
    );

    return this.sock.sendMessage(
      jid,
      {
        text: texto.trim(),
      }
    );
  }

  /**
   * ==================================================
   * ENVIAR ARQUIVO
   * ==================================================
   */
  async enviarArquivo(
    telefone: string,
    arquivo: Buffer,
    mimeType: string,
    nomeArquivo: string,
    texto?: string
  ) {
    if (!this.sock) {
      throw new Error(
        "WhatsApp não está inicializado."
      );
    }

    if (!this.conectado) {
      throw new Error(
        "WhatsApp não está conectado."
      );
    }

    if (
      !arquivo ||
      arquivo.length === 0
    ) {
      throw new Error(
        "Arquivo não informado."
      );
    }

    const numero =
      telefone.replace(
        /\D/g,
        ""
      );

    if (!numero) {
      throw new Error(
        "Número de telefone inválido."
      );
    }

    if (!mimeType) {
      throw new Error(
        "Tipo MIME não informado."
      );
    }

    if (!nomeArquivo) {
      throw new Error(
        "Nome do arquivo não informado."
      );
    }

    const jid =
      `${numero}@s.whatsapp.net`;

    const mime =
      mimeType.toLowerCase();

    console.log(
      "📤 GestãoM → WhatsApp: enviando arquivo"
    );

    console.log(
      "Telefone:",
      numero
    );

    console.log(
      "Arquivo:",
      nomeArquivo
    );

    console.log(
      "MIME:",
      mime
    );

    console.log(
      "Tamanho:",
      arquivo.length
    );

    /**
     * ==================================================
     * IMAGEM
     * ==================================================
     */
    if (
      mime.startsWith(
        "image/"
      )
    ) {
      return this.sock.sendMessage(
        jid,
        {
          image: arquivo,
          mimetype: mime,
          caption:
            texto?.trim() ||
            undefined,
        }
      );
    }

    /**
     * ==================================================
     * VÍDEO
     * ==================================================
     */
    if (
      mime.startsWith(
        "video/"
      )
    ) {
      return this.sock.sendMessage(
        jid,
        {
          video: arquivo,
          mimetype: mime,
          caption:
            texto?.trim() ||
            undefined,
        }
      );
    }

    /**
     * ==================================================
     * ÁUDIO
     * ==================================================
     */
    if (
      mime.startsWith(
        "audio/"
      )
    ) {
      return this.sock.sendMessage(
        jid,
        {
          audio: arquivo,
          mimetype: mime,
          ptt: false,
        }
      );
    }

    /**
     * ==================================================
     * DOCUMENTO
     * ==================================================
     */
    return this.sock.sendMessage(
      jid,
      {
        document: arquivo,
        mimetype: mime,
        fileName: nomeArquivo,
        caption:
          texto?.trim() ||
          undefined,
      }
    );
  }

  /**
   * ==================================================
   * RETORNAR QR CODE
   * ==================================================
   */
  getQRCode() {
    return this.qrCode;
  }

  /**
   * ==================================================
   * VERIFICAR CONEXÃO
   * ==================================================
   */
  isConectado() {
    return this.conectado;
  }

  /**
   * ==================================================
   * STATUS
   * ==================================================
   */
  getStatus() {
    return {
      conectado:
        this.conectado,

      qrCode:
        this.qrCode,
    };
  }

  /**
   * ==================================================
   * DESCONECTAR
   * ==================================================
   */
  async desconectar() {
    if (!this.sock) {
      return;
    }

    try {
      await this.sock.logout();
    } catch (error) {
      console.error(
        "Erro ao desconectar WhatsApp:",
        error
      );
    }

    this.sock = null;

    this.conectado =
      false;

    this.qrCode =
      null;

    this.inicializando =
      false;
  }
}

export const whatsappClient =
  new WhatsAppClient();