import { createDecipheriv, createHmac } from "crypto";

import makeWASocket, {
  DisconnectReason,
  downloadMediaMessage,
  useMultiFileAuthState,
  WASocket,
  proto,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import path from "path";
import fs from "fs/promises";

import prismaClient from "../../prisma";
import { getIO } from "../../socket";

import ReceberWhatsAppService from "../services/ReceberWhatsAppService";

export class WhatsAppClient {
  private sock: WASocket | null = null;

  /**
   * Guarda o MessageSecret das mensagens recebidas.
   *
   * O WhatsApp usa esse segredo para descriptografar
   * mensagens editadas através de secretEncryptedMessage.
   */
  private messageSecrets = new Map<
    string,
    {
      secret: Buffer;
      senderJid: string;
    }
  >();

  private qrCode: string | null = null;

  private conectado = false;

  private inicializando = false;

  private reconnectTimer:
    ReturnType<typeof setTimeout> | null = null;

  private reconnectAttempts = 0;

  private readonly reconnectDelay = 5000;

  private readonly maxReconnectDelay = 30000;

  private readonly authPath = path.resolve(
    process.cwd(),
    "whatsapp_auth"
  );

  private readonly uploadsPath = path.resolve(
    process.cwd(),
    "uploads",
    "chat"
  );

  // ============================================================
  // NORMALIZAR TELEFONE
  // ============================================================

  private normalizarTelefone(
    telefone: string
  ): string {
    const numero = telefone.replace(/\D/g, "");

    if (!numero) {
      throw new Error(
        "Número de telefone inválido."
      );
    }

    // Número já possui código do Brasil
    if (numero.startsWith("55")) {
      return numero;
    }

    // Número brasileiro sem código do país
    if (
      numero.length === 10 ||
      numero.length === 11
    ) {
      return `55${numero}`;
    }

    // Mantém números internacionais
    return numero;
  }

  // ============================================================
  // INICIAR WHATSAPP
  // ============================================================

  async iniciar(): Promise<void> {
    if (this.inicializando) {
      console.log(
        "WhatsApp já está sendo inicializado."
      );

      return;
    }

    if (this.conectado && this.sock) {
      console.log(
        "WhatsApp já está conectado."
      );

      return;
    }

    this.cancelarReconexao();

    this.inicializando = true;

    try {
      await fs.mkdir(
        this.uploadsPath,
        {
          recursive: true,
        }
      );

      console.log(
        "========================================"
      );

      console.log(
        "Inicializando conexão com WhatsApp..."
      );

      console.log(
        "Tentativa:",
        this.reconnectAttempts + 1
      );

      console.log(
        "========================================"
      );

      const {
        state,
        saveCreds,
      } =
        await useMultiFileAuthState(
          this.authPath
        );

      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: [
          "GestaoM",
          "Chrome",
          "1.0.0",
        ],
      });

      this.sock = sock;

      sock.ev.on(
        "creds.update",
        saveCreds
      );

      // ========================================================
      // STATUS DA CONEXÃO
      // ========================================================

      sock.ev.on(
        "connection.update",
        async (update) => {
          const {
            connection,
            lastDisconnect,
            qr,
          } = update;

          if (qr) {
            try {
              this.qrCode =
                await QRCode.toDataURL(qr);

              console.log(
                "Novo QR Code do WhatsApp disponível."
              );
            } catch (error) {
              console.error(
                "Erro ao gerar QR Code:",
                error
              );
            }
          }

          if (connection === "open") {
            if (this.sock !== sock) {
              console.log(
                "Evento de conexão antiga ignorado."
              );

              return;
            }

            this.conectado = true;

            this.inicializando = false;

            this.qrCode = null;

            this.reconnectAttempts = 0;

            this.cancelarReconexao();

            console.log(
              "========================================"
            );

            console.log(
              "WhatsApp conectado com sucesso."
            );

            console.log(
              "========================================"
            );

            return;
          }

          if (connection === "close") {
            if (this.sock !== sock) {
              console.log(
                "Conexão antiga encerrada. Evento ignorado."
              );

              return;
            }

            this.conectado = false;

            this.inicializando = false;

            this.sock = null;

            this.qrCode = null;

            const statusCode =
              (lastDisconnect?.error as Boom)
                ?.output?.statusCode;

            console.log(
              "========================================"
            );

            console.log(
              "WhatsApp foi desconectado."
            );

            console.log(
              "Código da desconexão:",
              statusCode
            );

            console.log(
              "========================================"
            );

            if (
              statusCode ===
              DisconnectReason.loggedOut
            ) {
              console.log(
                "Sessão do WhatsApp foi encerrada."
              );

              console.log(
                "Removendo credenciais..."
              );

              try {
                await fs.rm(
                  this.authPath,
                  {
                    recursive: true,
                    force: true,
                  }
                );

                console.log(
                  "Credenciais removidas."
                );
              } catch (error) {
                console.error(
                  "Erro ao remover credenciais:",
                  error
                );
              }

              this.reconnectAttempts = 0;

              this.agendarReconexao(
                1000
              );

              return;
            }

            const delay =
              this.calcularDelayReconexao();

            console.log(
              `Reconexão automática em ${
                delay / 1000
              } segundos...`
            );

            this.agendarReconexao(
              delay
            );
          }
        }
      );

      // ========================================================
      // RECEBIMENTO DE MENSAGENS
      // ========================================================

      sock.ev.on(
        "messages.upsert",
        async ({ messages }) => {
          for (const message of messages) {
            try {
              console.log(
                "🟣 WHATSAPP messages.upsert:",
                JSON.stringify(
                  message,
                  null,
                  2
                )
              );

              // ============================================================
              // GUARDA O MESSAGE SECRET DA MENSAGEM ORIGINAL
              // ============================================================

              this.salvarMessageSecret(
                message
              );

              // ============================================================
              // SECRET ENCRYPTED MESSAGE
              //
              // O WhatsApp atualmente pode enviar uma edição através
              // de secretEncryptedMessage em vez de protocolMessage.
              // ============================================================

              const secretMessage =
                message.message
                  ?.secretEncryptedMessage;

              if (
                secretMessage &&
                secretMessage.secretEncType ===
                  proto.Message.SecretEncryptedMessage.SecretEncType
                    .MESSAGE_EDIT
              ) {
                console.log(
                  "🟠 SECRET ENCRYPTED MESSAGE - MESSAGE_EDIT"
                );

                const targetKey =
                  secretMessage.targetMessageKey;

                const originalMessageId =
                  targetKey?.id;

                if (!originalMessageId) {
                  console.log(
                    "🟡 MESSAGE_EDIT sem ID da mensagem original."
                  );

                  continue;
                }

                console.log(
                  "🟠 ID DA MENSAGEM ORIGINAL:",
                  originalMessageId
                );

                // ==========================================================
                // BUSCAR O MESSAGE SECRET
                // ==========================================================

                const cachedMessage =
                  this.messageSecrets.get(
                    originalMessageId
                  );

                if (!cachedMessage) {
                  console.log(
                    "🔴 MESSAGE_SECRET não encontrado para:",
                    originalMessageId
                  );

                  console.log(
                    "🔴 A edição não pode ser descriptografada."
                  );

                  continue;
                }

                const messageSecret =
                  cachedMessage.secret;

                // ==========================================================
                // IMPORTANTE:
                //
                // NÃO usamos targetKey.remoteJid como remetente original.
                //
                // O WhatsApp pode colocar outro LID nessa estrutura.
                //
                // O remetente original foi guardado quando a mensagem
                // original chegou.
                // ==========================================================

                const originalSenderJid =
                  cachedMessage.senderJid;

                // ==========================================================
                // JID DE QUEM EDITOU
                // ==========================================================

                const editorJid =
                  message.key?.participant ||
                  message.key?.remoteJid;

                if (
                  !originalSenderJid ||
                  !editorJid
                ) {
                  console.log(
                    "🔴 Não foi possível determinar os JIDs da edição.",
                    {
                      originalSenderJid,
                      editorJid,
                    }
                  );

                  continue;
                }

                console.log(
                  "🟢 JIDs da edição:",
                  {
                    originalMessageId,
                    originalSenderJid,
                    editorJid,
                  }
                );

                // ==========================================================
                // DESCRIPTOGRAFAR
                // ==========================================================

                let decoded: proto.Message;

                try {
                  decoded =
                    this.descriptografarMensagemEditada(
                      secretMessage,
                      messageSecret,
                      originalMessageId,
                      originalSenderJid,
                      editorJid
                    );
                } catch (error) {
                  console.error(
                    "🔴 ERRO AO DESCRIPTOGRAFAR MESSAGE_EDIT:",
                    error
                  );

                  continue;
                }

                console.log(
                  "🟢 EDIT DECRYPTED:",
                  JSON.stringify(
                    decoded,
                    null,
                    2
                  )
                );

                // ==========================================================
                // VERIFICAR PROTOCOL MESSAGE
                // ==========================================================

                const protocolMessage =
                  decoded.protocolMessage;

                if (
                  !protocolMessage ||
                  protocolMessage.type !==
                    proto.Message.ProtocolMessage.Type
                      .MESSAGE_EDIT
                ) {
                  console.log(
                    "🔴 Payload descriptografado não contém MESSAGE_EDIT."
                  );

                  continue;
                }

                // ==========================================================
                // PEGAR NOVO TEXTO
                // ==========================================================

                const editedMessage =
                  protocolMessage.editedMessage;

                let novoTexto = "";

                if (
                  editedMessage?.conversation
                ) {
                  novoTexto =
                    editedMessage.conversation;
                } else if (
                  editedMessage
                    ?.extendedTextMessage
                    ?.text
                ) {
                  novoTexto =
                    editedMessage
                      .extendedTextMessage
                      .text;
                }

                if (!novoTexto.trim()) {
                  console.log(
                    "🟡 Edição descriptografada sem texto."
                  );

                  continue;
                }

                console.log(
                  "🟢 NOVO TEXTO:",
                  novoTexto
                );

                // ==========================================================
                // LOCALIZAR MENSAGEM NO BANCO
                // ==========================================================

                const mensagemOriginal =
                  await prismaClient.mensagem.findUnique({
                    where: {
                      whatsappId:
                        originalMessageId,
                    },
                  });

                if (!mensagemOriginal) {
                  console.log(
                    "🔴 Mensagem original não encontrada no banco:",
                    originalMessageId
                  );

                  continue;
                }

                // ==========================================================
                // ATUALIZAR BANCO
                // ==========================================================

                const mensagemAtualizada =
                  await prismaClient.mensagem.update({
                    where: {
                      id:
                        mensagemOriginal.id,
                    },
                    data: {
                      texto:
                        novoTexto.trim(),
                      editada: true,
                    },
                  });

                console.log(
                  "✅ MENSAGEM EDITADA NO BANCO:",
                  mensagemAtualizada
                );

                // ==========================================================
                // SOCKET.IO
                // ==========================================================

                const io = getIO();

                io.emit(
                  "mensagemAtualizada",
                  mensagemAtualizada
                );

                console.log(
                  "📡 mensagemAtualizada emitida pelo Socket.IO"
                );

                continue;
              }

              // ============================================================
              // PROTOCOL MESSAGE NORMAL
              // ============================================================

              const protocolMessage =
                message.message
                  ?.protocolMessage;

              if (protocolMessage) {
                console.log(
                  "🟠 PROTOCOL MESSAGE:",
                  JSON.stringify(
                    protocolMessage,
                    null,
                    2
                  )
                );

                const tipo =
                  protocolMessage.type;

                const mensagemOriginalId =
                  protocolMessage.key?.id;

                if (
                  mensagemOriginalId
                ) {
                  const mensagemOriginal =
                    await prismaClient.mensagem.findUnique({
                      where: {
                        whatsappId:
                          mensagemOriginalId,
                      },
                    });

                  if (mensagemOriginal) {
                    // ======================================================
                    // APAGADA
                    // ======================================================

                    if (
                      tipo ===
                      proto.Message.ProtocolMessage.Type
                        .REVOKE
                    ) {
                      const mensagemApagada =
                        await prismaClient.mensagem.update({
                          where: {
                            id:
                              mensagemOriginal.id,
                          },
                          data: {
                            apagada: true,
                            texto:
                              "Mensagem apagada",
                          },
                        });

                      const io = getIO();

                      io.emit(
                        "mensagemAtualizada",
                        mensagemApagada
                      );

                      console.log(
                        "✅ MENSAGEM APAGADA"
                      );

                      continue;
                    }

                    // ======================================================
                    // MESSAGE_EDIT LEGACY
                    // ======================================================

                    if (
                      tipo ===
                      proto.Message.ProtocolMessage.Type
                        .MESSAGE_EDIT
                    ) {
                      const mensagemEditada =
                        protocolMessage.editedMessage;

                      let novoTexto = "";

                      if (
                        mensagemEditada
                          ?.conversation
                      ) {
                        novoTexto =
                          mensagemEditada
                            .conversation;
                      } else if (
                        mensagemEditada
                          ?.extendedTextMessage
                          ?.text
                      ) {
                        novoTexto =
                          mensagemEditada
                            .extendedTextMessage
                            .text;
                      }

                      if (
                        !novoTexto.trim()
                      ) {
                        continue;
                      }

                      const mensagemAtualizada =
                        await prismaClient.mensagem.update({
                          where: {
                            id:
                              mensagemOriginal.id,
                          },
                          data: {
                            texto:
                              novoTexto.trim(),
                            editada: true,
                          },
                        });

                      const io = getIO();

                      io.emit(
                        "mensagemAtualizada",
                        mensagemAtualizada
                      );

                      console.log(
                        "✅ MENSAGEM EDITADA - FORMATO LEGACY"
                      );

                      continue;
                    }
                  }
                }

                continue;
              }

              // ============================================================
              // MENSAGEM NORMAL
              // ============================================================

              await this.processarMensagemRecebida(
                sock,
                message
              );
            } catch (error) {
              console.error(
                "❌ Erro ao processar messages.upsert:",
                error
              );
            }
          }
        }
      );

      // ========================================================
      // STATUS DAS MENSAGENS ENVIADAS
      // ========================================================

      sock.ev.on(
        "messages.update",
        async (updates) => {
          for (const update of updates) {
            try {
              console.log(
                "🟣 WHATSAPP messages.update:",
                JSON.stringify(
                  update,
                  null,
                  2
                )
              );

              const whatsappId =
                update.key?.id;

              if (!whatsappId) {
                console.log(
                  "🟡 messages.update sem update.key.id"
                );

                continue;
              }

              // ============================================================
              // 1. VERIFICAR EDIÇÃO / EXCLUSÃO DA MENSAGEM
              // ============================================================

              const mensagemAtualizacao =
                update.update?.message;

              const protocolMessage =
                mensagemAtualizacao
                  ?.protocolMessage;

              if (protocolMessage) {
                console.log(
                  "🟠 PROTOCOL MESSAGE:",
                  JSON.stringify(
                    protocolMessage,
                    null,
                    2
                  )
                );

                const tipo =
                  protocolMessage.type;

                const mensagemOriginalId =
                  protocolMessage.key?.id;

                console.log(
                  "🟠 TIPO PROTOCOL:",
                  tipo
                );

                console.log(
                  "🟠 ID MENSAGEM ORIGINAL:",
                  mensagemOriginalId
                );

                if (mensagemOriginalId) {
                  const mensagemOriginal =
                    await prismaClient.mensagem.findUnique({
                      where: {
                        whatsappId:
                          mensagemOriginalId,
                      },
                    });

                  if (!mensagemOriginal) {
                    console.log(
                      "🟡 Mensagem original não encontrada no banco:",
                      mensagemOriginalId
                    );
                  }

                  if (mensagemOriginal) {
                    // ======================================================
                    // MENSAGEM APAGADA
                    // ======================================================

                    if (
                      tipo ===
                      proto.Message.ProtocolMessage.Type
                        .REVOKE
                    ) {
                      console.log(
                        "🔴 MENSAGEM APAGADA:",
                        mensagemOriginal.id
                      );

                      const mensagemApagada =
                        await prismaClient.mensagem.update({
                          where: {
                            id:
                              mensagemOriginal.id,
                          },
                          data: {
                            apagada: true,
                            texto:
                              "Mensagem apagada",
                          },
                        });

                      const io = getIO();

                      io.emit(
                        "mensagemAtualizada",
                        mensagemApagada
                      );

                      console.log(
                        "✅ MENSAGEM APAGADA ATUALIZADA NO BANCO E EMITIDA NO SOCKET"
                      );

                      continue;
                    }

                    // ======================================================
                    // MENSAGEM EDITADA
                    // ======================================================

                    if (
                      tipo ===
                      proto.Message.ProtocolMessage.Type
                        .MESSAGE_EDIT
                    ) {
                      console.log(
                        "🟢 MENSAGEM EDITADA:",
                        mensagemOriginal.id
                      );

                      const mensagemEditada =
                        protocolMessage.editedMessage;

                      let novoTexto = "";

                      if (
                        mensagemEditada?.conversation
                      ) {
                        novoTexto =
                          mensagemEditada.conversation;
                      } else if (
                        mensagemEditada
                          ?.extendedTextMessage
                          ?.text
                      ) {
                        novoTexto =
                          mensagemEditada
                            .extendedTextMessage
                            .text;
                      }

                      console.log(
                        "🟢 NOVO TEXTO:",
                        novoTexto
                      );

                      if (
                        !novoTexto.trim()
                      ) {
                        console.log(
                          "🟡 Não foi possível encontrar o novo texto da mensagem editada."
                        );

                        continue;
                      }

                      const mensagemAtualizada =
                        await prismaClient.mensagem.update({
                          where: {
                            id:
                              mensagemOriginal.id,
                          },
                          data: {
                            texto:
                              novoTexto.trim(),
                            editada: true,
                          },
                        });

                      const io = getIO();

                      io.emit(
                        "mensagemAtualizada",
                        mensagemAtualizada
                      );

                      console.log(
                        "✅ MENSAGEM EDITADA ATUALIZADA NO BANCO E EMITIDA NO SOCKET"
                      );

                      continue;
                    }
                  }
                }
              }

              // ============================================================
              // 2. STATUS NORMAL DA MENSAGEM
              // ============================================================

              const status =
                update.update?.status;

              if (status === undefined) {
                continue;
              }

              const statusNumero =
                Number(status);

              let novoStatus:
                | "SENT"
                | "DELIVERED"
                | "READ"
                | null = null;

              let lida:
                | boolean
                | undefined;

              // SENT
              if (statusNumero === 2) {
                novoStatus = "SENT";
                lida = false;
              }

              // DELIVERED
              if (statusNumero === 3) {
                novoStatus = "DELIVERED";
                lida = false;
              }

              // READ
              if (statusNumero === 4) {
                novoStatus = "READ";
                lida = true;
              }

              if (!novoStatus) {
                continue;
              }

              const mensagem =
                await prismaClient.mensagem.findUnique({
                  where: {
                    whatsappId,
                  },
                });

              if (!mensagem) {
                continue;
              }

              const ordemStatus = {
                FAILED: 0,
                PENDING: 1,
                SENT: 2,
                DELIVERED: 3,
                READ: 4,
              };

              const statusAtual =
                mensagem.status ??
                "PENDING";

              if (
                (ordemStatus[novoStatus] ?? 0) <=
                (ordemStatus[statusAtual] ?? 0)
              ) {
                continue;
              }

              const mensagemAtualizada =
                await prismaClient.mensagem.update({
                  where: {
                    id: mensagem.id,
                  },
                  data: {
                    status: novoStatus,
                    ...(lida !== undefined
                      ? { lida }
                      : {}),
                  },
                });

              const io = getIO();

              io.emit(
                "mensagemAtualizada",
                mensagemAtualizada
              );

              io.emit(
                "conversaAtualizada",
                {
                  conversaId:
                    mensagemAtualizada.conversaId,
                  ultimaMensagem:
                    undefined,
                  ultimaData:
                    undefined,
                }
              );

              console.log(
                "📊 STATUS DA MENSAGEM ATUALIZADO:",
                mensagemAtualizada.id,
                novoStatus
              );
            } catch (error) {
              console.error(
                "❌ Erro ao processar messages.update:",
                error
              );
            }
          }
        }
      );
    } catch (error) {
      this.sock = null;

      this.conectado = false;

      this.inicializando = false;

      console.error(
        "Erro ao iniciar WhatsApp:",
        error
      );

      const delay =
        this.calcularDelayReconexao();

      console.log(
        `Nova tentativa em ${
          delay / 1000
        } segundos...`
      );

      this.agendarReconexao(
        delay
      );
    }
  }

  // ============================================================
  // SALVAR MESSAGE SECRET
  // ============================================================

  private salvarMessageSecret(
    message: any
  ) {
    const whatsappId =
      message?.key?.id;

    if (!whatsappId) {
      return;
    }

    const messageSecret =
      message?.message
        ?.messageContextInfo
        ?.messageSecret;

    if (!messageSecret) {
      return;
    }

    const senderJid =
      message?.key?.participant ||
      message?.key?.remoteJid;

    if (!senderJid) {
      console.log(
        "⚠️ Não foi possível identificar o remetente da mensagem para armazenar o MessageSecret."
      );

      return;
    }

    const secret =
      Buffer.isBuffer(messageSecret)
        ? messageSecret
        : Buffer.from(messageSecret);

    this.messageSecrets.set(
      whatsappId,
      {
        secret,
        senderJid,
      }
    );

    console.log(
      "🔐 MessageSecret armazenado:",
      {
        whatsappId,
        senderJid,
      }
    );

    /**
     * Mantém o segredo em memória por 15 minutos.
     *
     * Isso evita manter segredos indefinidamente,
     * mas permite que uma edição feita logo depois
     * da mensagem original seja descriptografada.
     */
    setTimeout(
      () => {
        this.messageSecrets.delete(
          whatsappId
        );
      },
      15 * 60 * 1000
    );
  }

  // ============================================================
  // DESCRIPTOGRAFAR MENSAGEM EDITADA
  // ============================================================

  private descriptografarMensagemEditada(
    secretMessage: any,
    messageSecret: Buffer,
    originalMessageId: string,
    originalSenderJid: string,
    editorJid: string
  ): proto.Message {
    /**
     * Algoritmo utilizado pelo WhatsApp para
     * secretEncryptedMessage / MESSAGE_EDIT.
     *
     * info:
     *
     * messageId
     * +
     * remetente original
     * +
     * editor
     * +
     * "Message Edit"
     * +
     * 0x01
     */

    const sign =
      Buffer.concat([
        Buffer.from(
          originalMessageId
        ),

        Buffer.from(
          originalSenderJid
        ),

        Buffer.from(
          editorJid
        ),

        Buffer.from(
          "Message Edit"
        ),

        Buffer.from([1]),
      ]);

    // ==========================================================
    // PRIMEIRA DERIVAÇÃO DA CHAVE
    // ==========================================================

    const key0 =
      createHmac(
        "sha256",
        Buffer.alloc(32)
      )
        .update(
          messageSecret
        )
        .digest();

    // ==========================================================
    // CHAVE FINAL AES-256-GCM
    // ==========================================================

    const encryptionKey =
      createHmac(
        "sha256",
        key0
      )
        .update(sign)
        .digest();

    // ==========================================================
    // IV
    // ==========================================================

    const iv =
      Buffer.from(
        secretMessage.encIv
      );

    // ==========================================================
    // PAYLOAD
    // ==========================================================

    const payload =
      Buffer.from(
        secretMessage.encPayload
      );

    if (
      payload.length <= 16
    ) {
      throw new Error(
        "Payload criptografado inválido ou muito pequeno."
      );
    }

    // Os últimos 16 bytes são o Authentication Tag
    const ciphertext =
      payload.subarray(
        0,
        payload.length - 16
      );

    const authTag =
      payload.subarray(
        payload.length - 16
      );

    // ==========================================================
    // AES-256-GCM
    // ==========================================================

    const decipher =
      createDecipheriv(
        "aes-256-gcm",
        encryptionKey,
        iv
      );

    /**
     * O WhatsApp utiliza AAD vazio nessa operação.
     */
    decipher.setAAD(
      Buffer.alloc(0)
    );

    decipher.setAuthTag(
      authTag
    );

    const decrypted =
      Buffer.concat([
        decipher.update(
          ciphertext
        ),

        decipher.final(),
      ]);

    // ==========================================================
    // DECODIFICAR PROTOBUF
    // ==========================================================

    return proto.Message.decode(
      decrypted
    );
  }

  // ============================================================
  // PROCESSAR MENSAGEM RECEBIDA
  // ============================================================

  private async processarMensagemRecebida(
    sock: WASocket,
    message: any
  ): Promise<void> {
    if (!message?.message) {
      return;
    }

    if (message.key?.fromMe) {
      return;
    }

    const remoteJid =
      message.key?.remoteJid;

    if (!remoteJid) {
      return;
    }

    if (
      remoteJid.endsWith("@g.us")
    ) {
      return;
    }

    if (
      remoteJid ===
      "status@broadcast"
    ) {
      return;
    }

    const nome =
      message.pushName?.trim() ||
      remoteJid;

    // ========================================================
    // LID → NÚMERO DE TELEFONE
    // ========================================================

    let telefone =
      remoteJid;

    if (
      remoteJid.endsWith("@lid")
    ) {
      try {
        console.log(
          "========================================"
        );

        console.log(
          "WhatsApp: mensagem recebida via LID"
        );

        console.log(
          "LID recebido:",
          remoteJid
        );

        const pn =
          await sock.signalRepository.lidMapping.getPNForLID(
            remoteJid
          );

        if (!pn) {
          console.warn(
            "WhatsApp: não foi possível converter LID para telefone:",
            remoteJid
          );

          return;
        }

        telefone =
          pn
            .split("@")[0]
            .split(":")[0];

        console.log(
          "WhatsApp: LID convertido para PN:",
          remoteJid,
          "→",
          telefone
        );
      } catch (error) {
        console.error(
          "WhatsApp: erro ao converter LID:",
          remoteJid,
          error
        );

        return;
      }
    }

    const telefoneLimpo =
      telefone.replace(
        /\D/g,
        ""
      );

    if (!telefoneLimpo) {
      console.warn(
        "WhatsApp: telefone inválido:",
        telefone
      );

      return;
    }

    // ========================================================
    // IDENTIFICAR TIPO DA MENSAGEM
    // ========================================================

    const conteudo =
      this.obterConteudoMensagem(
        message.message
      );

    if (!conteudo) {
      console.log(
        "WhatsApp: tipo de mensagem não suportado."
      );

      return;
    }

    console.log(
      "========================================"
    );

    console.log(
      "WHATSAPP → GESTAOM"
    );

    console.log(
      "Telefone:",
      telefoneLimpo
    );

    console.log(
      "Nome:",
      nome
    );

    console.log(
      "Tipo:",
      conteudo.tipo
    );

    console.log(
      "Texto:",
      conteudo.texto ||
        "(sem texto)"
    );

    console.log(
      "========================================"
    );

    // ========================================================
    // TEXTO
    // ========================================================

    if (
      conteudo.tipo ===
      "TEXTO"
    ) {
      await ReceberWhatsAppService.execute(
        {
          telefone:
            telefoneLimpo,

          nome,

          texto:
            conteudo.texto,

          tipo:
            "TEXTO",

          whatsappId:
            message.key?.id ??
            null,
        }
      );

      return;
    }

    // ========================================================
    // ARQUIVO / MÍDIA
    // ========================================================

    const arquivo =
      await this.baixarMidia(
        sock,
        message,
        {
          tipo:
            conteudo.tipo as
              | "IMAGEM"
              | "DOCUMENTO"
              | "AUDIO"
              | "VIDEO",

          texto:
            conteudo.texto,

          mediaMessage:
            conteudo.mediaMessage,
        }
      );

    if (!arquivo) {
      console.warn(
        "Não foi possível baixar a mídia recebida."
      );

      return;
    }

    await ReceberWhatsAppService.execute(
      {
        telefone:
          telefoneLimpo,

        nome,

        texto:
          conteudo.texto,

        tipo:
          conteudo.tipo,

        nomeArquivo:
          arquivo.nomeArquivo,

        mimeType:
          arquivo.mimeType,

        tamanho:
          arquivo.tamanho,

        arquivoUrl:
          arquivo.arquivoUrl,

        whatsappId:
          message.key?.id ??
          null,
      }
    );

    console.log(
      "========================================"
    );

    console.log(
      "ARQUIVO RECEBIDO COM SUCESSO"
    );

    console.log(
      "Tipo:",
      conteudo.tipo
    );

    console.log(
      "Arquivo:",
      arquivo.nomeArquivo
    );

    console.log(
      "MIME:",
      arquivo.mimeType
    );

    console.log(
      "Tamanho:",
      arquivo.tamanho
    );

    console.log(
      "URL:",
      arquivo.arquivoUrl
    );

    console.log(
      "========================================"
    );
  }

  // ============================================================
  // IDENTIFICAR CONTEÚDO
  // ============================================================

  private obterConteudoMensagem(
    mensagem: any
  ):
    | {
        tipo:
          | "TEXTO"
          | "IMAGEM"
          | "DOCUMENTO"
          | "AUDIO"
          | "VIDEO";

        texto: string;

        mediaMessage:
          | any
          | null;
      }
    | null {
    if (
      mensagem.conversation
    ) {
      return {
        tipo: "TEXTO",

        texto:
          mensagem.conversation,

        mediaMessage: null,
      };
    }

    if (
      mensagem.extendedTextMessage
        ?.text
    ) {
      return {
        tipo: "TEXTO",

        texto:
          mensagem.extendedTextMessage
            .text,

        mediaMessage: null,
      };
    }

    if (
      mensagem.imageMessage
    ) {
      return {
        tipo: "IMAGEM",

        texto:
          mensagem.imageMessage
            .caption ?? "",

        mediaMessage:
          mensagem.imageMessage,
      };
    }

    if (
      mensagem.documentMessage
    ) {
      return {
        tipo: "DOCUMENTO",

        texto:
          mensagem.documentMessage
            .caption ?? "",

        mediaMessage:
          mensagem.documentMessage,
      };
    }

    if (
      mensagem.audioMessage
    ) {
      return {
        tipo: "AUDIO",

        texto: "",

        mediaMessage:
          mensagem.audioMessage,
      };
    }

    if (
      mensagem.videoMessage
    ) {
      return {
        tipo: "VIDEO",

        texto:
          mensagem.videoMessage
            .caption ?? "",

        mediaMessage:
          mensagem.videoMessage,
      };
    }

    // Algumas mensagens podem vir
    // dentro de ephemeralMessage.
    if (
      mensagem.ephemeralMessage
        ?.message
    ) {
      return this.obterConteudoMensagem(
        mensagem.ephemeralMessage
          .message
      );
    }

    return null;
  }

  // ============================================================
  // BAIXAR MÍDIA
  // ============================================================

  private async baixarMidia(
    sock: WASocket,
    message: any,
    conteudo: {
      tipo:
        | "IMAGEM"
        | "DOCUMENTO"
        | "AUDIO"
        | "VIDEO";

      texto: string;

      mediaMessage: any;
    }
  ): Promise<{
    nomeArquivo: string;
    mimeType: string;
    tamanho: number;
    arquivoUrl: string;
  } | null> {
    try {
      await fs.mkdir(
        this.uploadsPath,
        {
          recursive: true,
        }
      );

      console.log(
        "Baixando mídia do WhatsApp..."
      );

      const buffer =
        await downloadMediaMessage(
          message,
          "buffer",
          {}
        );

      if (
        !buffer ||
        !Buffer.isBuffer(buffer) ||
        buffer.length === 0
      ) {
        console.warn(
          "Baileys não retornou um buffer válido."
        );

        return null;
      }

      const mimeType =
        conteudo.mediaMessage
          ?.mimetype ||
        "application/octet-stream";

      const nomeOriginal =
        conteudo.mediaMessage
          ?.fileName ||
        null;

      const extensao =
        this.obterExtensao(
          conteudo.tipo,
          mimeType,
          nomeOriginal
        );

      const nomeSeguro =
        nomeOriginal
          ? this.sanitizarNomeArquivo(
              nomeOriginal
            )
          : `${Date.now()}${extensao}`;

      const nomeArquivoFinal =
        nomeOriginal
          ? `${Date.now()}-${nomeSeguro}`
          : nomeSeguro;

      const caminhoArquivo =
        path.join(
          this.uploadsPath,
          nomeArquivoFinal
        );

      await fs.writeFile(
        caminhoArquivo,
        buffer
      );

      const arquivoUrl =
        `/uploads/chat/${encodeURIComponent(
          nomeArquivoFinal
        )}`;

      return {
        nomeArquivo:
          nomeOriginal ??
          nomeArquivoFinal,

        mimeType,

        tamanho:
          buffer.length,

        arquivoUrl,
      };
    } catch (error) {
      console.error(
        "Erro ao baixar mídia do WhatsApp:",
        error
      );

      return null;
    }
  }

  // ============================================================
  // EXTENSÃO DO ARQUIVO
  // ============================================================

  private obterExtensao(
    tipo:
      | "IMAGEM"
      | "DOCUMENTO"
      | "AUDIO"
      | "VIDEO",

    mimeType: string,

    nomeOriginal:
      | string
      | null
  ): string {
    if (nomeOriginal) {
      const extensao =
        path.extname(
          nomeOriginal
        );

      if (extensao) {
        return extensao.toLowerCase();
      }
    }

    const mime =
      mimeType.toLowerCase();

    const extensoes: Record<
      string,
      string
    > = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",

      "application/pdf": ".pdf",

      "audio/ogg": ".ogg",
      "audio/mpeg": ".mp3",
      "audio/mp3": ".mp3",
      "audio/wav": ".wav",
      "audio/webm": ".webm",

      "video/mp4": ".mp4",
      "video/3gpp": ".3gp",
      "video/webm": ".webm",
    };

    if (extensoes[mime]) {
      return extensoes[mime];
    }

    switch (tipo) {
      case "IMAGEM":
        return ".jpg";

      case "AUDIO":
        return ".ogg";

      case "VIDEO":
        return ".mp4";

      case "DOCUMENTO":
        return ".bin";

      default:
        return ".bin";
    }
  }

  // ============================================================
  // SANITIZAR NOME
  // ============================================================

  private sanitizarNomeArquivo(
    nome: string
  ): string {
    const nomeLimpo =
      path.basename(nome);

    return nomeLimpo
      .replace(
        /[^a-zA-Z0-9À-ÿ._-]/g,
        "_"
      )
      .replace(
        /_+/g,
        "_"
      );
  }

  // ============================================================
  // ENVIO DE TEXTO
  // ============================================================

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

    const numero =
      this.normalizarTelefone(
        telefone
      );

    const resultado =
      await this.sock.onWhatsApp(
        numero
      );

    if (
      !resultado ||
      resultado.length === 0 ||
      !resultado[0].exists
    ) {
      throw new Error(
        `O número ${numero} não possui uma conta WhatsApp.`
      );
    }

    const jid =
      resultado[0].jid;

    console.log(
      "WhatsApp: número confirmado:",
      numero
    );

    console.log(
      "WhatsApp: enviando mensagem para:",
      jid
    );

    const response =
      await this.sock.sendMessage(
        jid,
        {
          text: texto,
        }
      );

    return response;
  }

  // ============================================================
  // EDITAR MENSAGEM
  // ============================================================

  async editarMensagem(
    telefone: string,
    whatsappId: string,
    novoTexto: string
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

    const texto =
      novoTexto.trim();

    if (!texto) {
      throw new Error(
        "O novo texto da mensagem não pode ser vazio."
      );
    }

    if (!whatsappId) {
      throw new Error(
        "ID da mensagem do WhatsApp não informado."
      );
    }

    const numero =
      this.normalizarTelefone(
        telefone
      );

    const resultado =
      await this.sock.onWhatsApp(
        numero
      );

    if (
      !resultado ||
      resultado.length === 0 ||
      !resultado[0].exists
    ) {
      throw new Error(
        `O número ${numero} não possui uma conta WhatsApp.`
      );
    }

    const jid =
      resultado[0].jid;

    if (!jid) {
      throw new Error(
        "Não foi possível identificar o JID do WhatsApp."
      );
    }

    const resposta =
      await this.sock.sendMessage(
        jid,
        {
          text: texto,

          edit: {
            remoteJid: jid,
            fromMe: true,
            id: whatsappId,
          },
        }
      );

    return resposta;
  }

  // ============================================================
  // APAGAR MENSAGEM
  // ============================================================

  async apagarMensagem(
    telefone: string,
    whatsappId: string
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

    if (!whatsappId) {
      throw new Error(
        "ID da mensagem do WhatsApp não informado."
      );
    }

    const numero =
      this.normalizarTelefone(
        telefone
      );

    const resultado =
      await this.sock.onWhatsApp(
        numero
      );

    if (
      !resultado ||
      resultado.length === 0 ||
      !resultado[0].exists
    ) {
      throw new Error(
        `O número ${numero} não possui uma conta WhatsApp.`
      );
    }

    const jid =
      resultado[0].jid;

    if (!jid) {
      throw new Error(
        "Não foi possível identificar o JID do WhatsApp."
      );
    }

    const resposta =
      await this.sock.sendMessage(
        jid,
        {
          delete: {
            remoteJid: jid,
            fromMe: true,
            id: whatsappId,
          },
        }
      );

    return resposta;
  }

  // ============================================================
  // ENVIO DE ARQUIVO
  // ============================================================

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
      this.normalizarTelefone(
        telefone
      );

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

    const resultado =
      await this.sock.onWhatsApp(
        numero
      );

    if (
      !resultado ||
      resultado.length === 0 ||
      !resultado[0].exists
    ) {
      throw new Error(
        `O número ${numero} não possui uma conta WhatsApp.`
      );
    }

    const jid =
      resultado[0].jid;

    const mime =
      mimeType.toLowerCase();

    console.log(
      "========================================"
    );

    console.log(
      "GESTAOM → WHATSAPP"
    );

    console.log(
      "Enviando arquivo..."
    );

    console.log(
      "Telefone:",
      numero
    );

    console.log(
      "JID:",
      jid
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

    console.log(
      "========================================"
    );

    // ==========================================================
    // IMAGEM
    // ==========================================================

    if (
      mime.startsWith(
        "image/"
      )
    ) {
      return await this.sock.sendMessage(
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

    // ==========================================================
    // VÍDEO
    // ==========================================================

    if (
      mime.startsWith(
        "video/"
      )
    ) {
      return await this.sock.sendMessage(
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

    // ==========================================================
    // ÁUDIO
    // ==========================================================

    if (
      mime.startsWith(
        "audio/"
      )
    ) {
      return await this.sock.sendMessage(
        jid,
        {
          audio: arquivo,

          mimetype: mime,

          ptt: false,
        }
      );
    }

    // ==========================================================
    // DOCUMENTO
    // ==========================================================

    return await this.sock.sendMessage(
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

  // ============================================================
  // RECONEXÃO
  // ============================================================

  private calcularDelayReconexao(): number {
    const delay =
      Math.min(
        this.reconnectDelay *
          Math.pow(
            2,
            this.reconnectAttempts
          ),
        this.maxReconnectDelay
      );

    this.reconnectAttempts += 1;

    return delay;
  }

  private agendarReconexao(
    delay: number
  ): void {
    if (this.reconnectTimer) {
      console.log(
        "Reconexão já está agendada."
      );

      return;
    }

    this.reconnectTimer =
      setTimeout(
        () => {
          this.reconnectTimer =
            null;

          if (this.conectado) {
            console.log(
              "Reconexão cancelada: WhatsApp já está conectado."
            );

            return;
          }

          if (this.inicializando) {
            console.log(
              "Reconexão cancelada: WhatsApp já está inicializando."
            );

            return;
          }

          this.iniciar()
            .catch(
              (error) => {
                console.error(
                  "Erro durante reconexão do WhatsApp:",
                  error
                );
              }
            );
        },
        delay
      );
  }

  private cancelarReconexao(): void {
    if (!this.reconnectTimer) {
      return;
    }

    clearTimeout(
      this.reconnectTimer
    );

    this.reconnectTimer = null;

    console.log(
      "Reconexão agendada cancelada."
    );
  }

  // ============================================================
  // STATUS
  // ============================================================

  getQRCode(): string | null {
    return this.qrCode;
  }

  isConectado(): boolean {
    return this.conectado;
  }

  getStatus() {
    return {
      conectado:
        this.conectado,

      qrCode:
        this.qrCode,
    };
  }

  // ============================================================
  // DESCONECTAR
  // ============================================================

  async desconectar(): Promise<void> {
    this.cancelarReconexao();

    const sockAtual =
      this.sock;

    this.sock = null;

    this.conectado = false;

    this.qrCode = null;

    this.inicializando = false;

    this.reconnectAttempts = 0;

    if (!sockAtual) {
      console.log(
        "WhatsApp já estava desconectado."
      );

      return;
    }

    try {
      await sockAtual.logout();

      console.log(
        "WhatsApp desconectado manualmente."
      );
    } catch (error) {
      console.error(
        "Erro ao desconectar WhatsApp:",
        error
      );
    }
  }

  // ============================================================
  // TROCAR WHATSAPP
  // ============================================================

  async trocarWhatsApp(): Promise<void> {
    console.log(
      "========================================"
    );

    console.log(
      "INICIANDO TROCA DO WHATSAPP"
    );

    console.log(
      "========================================"
    );

    // ==========================================================
    // CANCELAR RECONEXÃO
    // ==========================================================

    this.cancelarReconexao();

    // ==========================================================
    // GUARDAR SOCKET ATUAL
    // ==========================================================

    const sockAtual =
      this.sock;

    // ==========================================================
    // IMPEDIR EVENTOS DA CONEXÃO ANTIGA
    // ==========================================================

    this.sock = null;

    this.conectado = false;

    this.inicializando = false;

    this.qrCode = null;

    this.reconnectAttempts = 0;

    // ==========================================================
    // DESCONECTAR SESSÃO ATUAL
    // ==========================================================

    if (sockAtual) {
      try {
        console.log(
          "Desconectando WhatsApp atual..."
        );

        await sockAtual.logout();

        console.log(
          "WhatsApp atual desconectado."
        );
      } catch (error) {
        console.error(
          "Erro ao fazer logout do WhatsApp atual:",
          error
        );
      }
    }

    // ==========================================================
    // REMOVER CREDENCIAIS
    // ==========================================================

    try {
      console.log(
        "Removendo credenciais antigas..."
      );

      await fs.rm(
        this.authPath,
        {
          recursive: true,
          force: true,
        }
      );

      console.log(
        "Credenciais antigas removidas."
      );
    } catch (error) {
      console.error(
        "Erro ao remover credenciais antigas:",
        error
      );

      throw new Error(
        "Não foi possível remover a sessão antiga do WhatsApp."
      );
    }

    // ==========================================================
    // PEQUENA PAUSA
    // ==========================================================

    await new Promise<void>(
      (resolve) => {
        setTimeout(
          resolve,
          500
        );
      }
    );

    // ==========================================================
    // INICIAR NOVA SESSÃO
    // ==========================================================

    console.log(
      "Iniciando nova sessão do WhatsApp..."
    );

    await this.iniciar();

    console.log(
      "========================================"
    );

    console.log(
      "TROCA DO WHATSAPP INICIADA"
    );

    console.log(
      "Aguardando novo QR Code..."
    );

    console.log(
      "========================================"
    );
  }
}

export const whatsappClient =
  new WhatsAppClient();