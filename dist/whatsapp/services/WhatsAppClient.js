"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappClient = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ReceberWhatsAppService_1 = __importDefault(require("../services/ReceberWhatsAppService"));
class WhatsAppClient {
    constructor() {
        this.sock = null;
        this.qrCode = null;
        this.conectado = false;
        this.inicializando = false;
        this.authPath = path_1.default.resolve(process.cwd(), "whatsapp_auth");
        this.uploadsPath = path_1.default.resolve(process.cwd(), "uploads", "chat");
    }
    /**
     * ==================================================
     * INICIALIZAR WHATSAPP
     * ==================================================
     */
    async iniciar() {
        if (this.inicializando) {
            console.log("WhatsApp já está inicializando...");
            return;
        }
        this.inicializando = true;
        try {
            fs_1.default.mkdirSync(this.authPath, {
                recursive: true,
            });
            fs_1.default.mkdirSync(this.uploadsPath, {
                recursive: true,
            });
            const { state, saveCreds, } = await (0, baileys_1.useMultiFileAuthState)(this.authPath);
            const sock = (0, baileys_1.default)({
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
            sock.ev.on("creds.update", saveCreds);
            /**
             * ==================================================
             * ATUALIZAÇÃO DA CONEXÃO
             * ==================================================
             */
            sock.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect, qr, } = update;
                /**
                 * QR CODE
                 */
                if (qr) {
                    try {
                        this.qrCode =
                            await qrcode_1.default.toDataURL(qr);
                        console.log("📱 Novo QR Code disponível.");
                    }
                    catch (error) {
                        console.error("Erro ao gerar QR Code:", error);
                    }
                }
                /**
                 * CONECTADO
                 */
                if (connection ===
                    "open") {
                    this.conectado =
                        true;
                    this.qrCode = null;
                    console.log("✅ WhatsApp conectado.");
                }
                /**
                 * DESCONECTADO
                 */
                if (connection ===
                    "close") {
                    this.conectado =
                        false;
                    const statusCode = lastDisconnect
                        ?.error?.output
                        ?.statusCode;
                    const deveReconectar = statusCode !==
                        baileys_1.DisconnectReason.loggedOut;
                    console.log("❌ WhatsApp desconectado.", {
                        statusCode,
                        deveReconectar,
                    });
                    this.sock = null;
                    if (deveReconectar) {
                        console.log("🔄 Reconectando WhatsApp...");
                        setTimeout(() => {
                            this.inicializando =
                                false;
                            this.iniciar();
                        }, 3000);
                        return;
                    }
                    console.log("⚠️ WhatsApp foi desconectado definitivamente.");
                    this.inicializando =
                        false;
                }
            });
            /**
             * ==================================================
             * RECEBIMENTO DE MENSAGENS
             * ==================================================
             */
            sock.ev.on("messages.upsert", async ({ messages, type, }) => {
                if (type !== "notify") {
                    return;
                }
                for (const message of messages) {
                    try {
                        /**
                         * Ignora mensagens enviadas
                         * pelo próprio WhatsApp.
                         */
                        if (message.key.fromMe) {
                            continue;
                        }
                        /**
                         * Ignora mensagens de status.
                         */
                        if (message.key.remoteJid ===
                            "status@broadcast") {
                            continue;
                        }
                        /**
                         * Ignora grupos.
                         */
                        if (message.key.remoteJid?.endsWith("@g.us")) {
                            continue;
                        }
                        let remoteJid = message.key.remoteJid;
                        if (!remoteJid) {
                            continue;
                        }
                        /**
                         * ==================================================
                         * CONVERSÃO DE LID PARA NÚMERO
                         * ==================================================
                         */
                        if (remoteJid.endsWith("@lid")) {
                            try {
                                const lid = remoteJid;
                                const pn = await sock
                                    .signalRepository
                                    .lidMapping
                                    .getPNForLID(lid);
                                if (pn) {
                                    console.log("WhatsApp: LID convertido para PN");
                                    console.log("LID recebido:", lid);
                                    console.log("Número convertido:", pn);
                                    remoteJid =
                                        pn;
                                }
                            }
                            catch (error) {
                                console.error("Erro ao converter LID:", error);
                            }
                        }
                        /**
                         * ==================================================
                         * NÚMERO DO TELEFONE
                         * ==================================================
                         */
                        const telefone = remoteJid
                            .replace("@s.whatsapp.net", "")
                            .replace(/\D/g, "");
                        if (!telefone) {
                            console.log("⚠️ Telefone não identificado.");
                            continue;
                        }
                        /**
                         * ==================================================
                         * NORMALIZA CONTEÚDO
                         * ==================================================
                         */
                        const conteudo = (0, baileys_1.normalizeMessageContent)(message.message);
                        if (!conteudo) {
                            continue;
                        }
                        /**
                         * ==================================================
                         * NOME DO CONTATO
                         * ==================================================
                         */
                        const nome = message.pushName ||
                            telefone;
                        let texto = "";
                        let tipo = "TEXTO";
                        let nomeArquivo;
                        let mimeType;
                        let tamanho;
                        let arquivoUrl;
                        /**
                         * ==================================================
                         * TEXTO
                         * ==================================================
                         */
                        if (conteudo.conversation) {
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
                        else if (conteudo
                            .extendedTextMessage
                            ?.text) {
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
                        else if (conteudo.imageMessage) {
                            const imagem = conteudo.imageMessage;
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
                            console.log("📥 Recebendo imagem...");
                            const buffer = await (0, baileys_1.downloadMediaMessage)(message, "buffer", {});
                            tamanho =
                                buffer.length;
                            const caminho = path_1.default.join(this.uploadsPath, nomeArquivo);
                            fs_1.default.writeFileSync(caminho, buffer);
                            arquivoUrl =
                                `/uploads/chat/${encodeURIComponent(nomeArquivo)}`;
                            console.log("Imagem salva:", caminho);
                        }
                        /**
                         * ==================================================
                         * DOCUMENTO
                         * ==================================================
                         */
                        else if (conteudo.documentMessage) {
                            const documento = conteudo.documentMessage;
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
                            console.log("📥 Recebendo documento...");
                            const buffer = await (0, baileys_1.downloadMediaMessage)(message, "buffer", {});
                            tamanho =
                                buffer.length;
                            const nomeSeguro = `${Date.now()}-${nomeArquivo}`;
                            const caminho = path_1.default.join(this.uploadsPath, nomeSeguro);
                            fs_1.default.writeFileSync(caminho, buffer);
                            nomeArquivo =
                                nomeSeguro;
                            arquivoUrl =
                                `/uploads/chat/${encodeURIComponent(nomeArquivo)}`;
                            console.log("Documento salvo:", caminho);
                        }
                        /**
                         * ==================================================
                         * ÁUDIO
                         * ==================================================
                         */
                        else if (conteudo.audioMessage) {
                            const audio = conteudo.audioMessage;
                            tipo =
                                "AUDIO";
                            mimeType =
                                audio.mimetype ||
                                    "audio/ogg";
                            const extensao = mimeType.includes("mpeg")
                                ? "mp3"
                                : "ogg";
                            nomeArquivo =
                                `${Date.now()}.${extensao}`;
                            texto =
                                "🎵 Áudio";
                            console.log("📥 Recebendo áudio...");
                            const buffer = await (0, baileys_1.downloadMediaMessage)(message, "buffer", {});
                            tamanho =
                                buffer.length;
                            const caminho = path_1.default.join(this.uploadsPath, nomeArquivo);
                            fs_1.default.writeFileSync(caminho, buffer);
                            arquivoUrl =
                                `/uploads/chat/${encodeURIComponent(nomeArquivo)}`;
                            console.log("Áudio salvo:", caminho);
                        }
                        /**
                         * ==================================================
                         * VÍDEO
                         * ==================================================
                         */
                        else if (conteudo.videoMessage) {
                            const video = conteudo.videoMessage;
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
                            console.log("📥 Recebendo vídeo...");
                            const buffer = await (0, baileys_1.downloadMediaMessage)(message, "buffer", {});
                            tamanho =
                                buffer.length;
                            const caminho = path_1.default.join(this.uploadsPath, nomeArquivo);
                            fs_1.default.writeFileSync(caminho, buffer);
                            arquivoUrl =
                                `/uploads/chat/${encodeURIComponent(nomeArquivo)}`;
                            console.log("Vídeo salvo:", caminho);
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
                            console.log("⚠️ Tipo de mensagem não tratado:");
                            console.log(Object.keys(conteudo));
                        }
                        /**
                         * ==================================================
                         * ENVIA PARA O SERVICE
                         * ==================================================
                         */
                        await ReceberWhatsAppService_1.default.execute({
                            telefone,
                            nome,
                            texto,
                            tipo,
                            nomeArquivo,
                            mimeType,
                            tamanho,
                            arquivoUrl,
                            whatsappId: message.key.id ||
                                null,
                        });
                        console.log("==========================================");
                        console.log("WhatsApp: mensagem recebida");
                        console.log("Telefone:", telefone);
                        console.log("Nome:", nome);
                        console.log("Tipo:", tipo);
                        console.log("Texto:", texto);
                        if (nomeArquivo) {
                            console.log("Arquivo:", nomeArquivo);
                        }
                        if (mimeType) {
                            console.log("MIME:", mimeType);
                        }
                        if (tamanho) {
                            console.log("Tamanho:", tamanho);
                        }
                        if (arquivoUrl) {
                            console.log("URL:", arquivoUrl);
                        }
                        console.log("WhatsApp ID:", message.key.id);
                        console.log("==========================================");
                    }
                    catch (error) {
                        console.error("❌ Erro ao processar mensagem recebida:", error);
                    }
                }
            });
        }
        catch (error) {
            console.error("❌ Erro ao inicializar WhatsApp:", error);
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
    async enviarTexto(telefone, texto) {
        if (!this.sock) {
            throw new Error("WhatsApp não está inicializado.");
        }
        if (!this.conectado) {
            throw new Error("WhatsApp não está conectado.");
        }
        if (!texto?.trim()) {
            throw new Error("Texto da mensagem não informado.");
        }
        const numero = telefone.replace(/\D/g, "");
        if (!numero) {
            throw new Error("Número de telefone inválido.");
        }
        const jid = `${numero}@s.whatsapp.net`;
        console.log("📤 GestãoM → WhatsApp: enviando texto", {
            telefone: numero,
            texto,
        });
        return this.sock.sendMessage(jid, {
            text: texto.trim(),
        });
    }
    /**
     * ==================================================
     * ENVIAR ARQUIVO
     * ==================================================
     */
    async enviarArquivo(telefone, arquivo, mimeType, nomeArquivo, texto) {
        if (!this.sock) {
            throw new Error("WhatsApp não está inicializado.");
        }
        if (!this.conectado) {
            throw new Error("WhatsApp não está conectado.");
        }
        if (!arquivo ||
            arquivo.length === 0) {
            throw new Error("Arquivo não informado.");
        }
        const numero = telefone.replace(/\D/g, "");
        if (!numero) {
            throw new Error("Número de telefone inválido.");
        }
        if (!mimeType) {
            throw new Error("Tipo MIME não informado.");
        }
        if (!nomeArquivo) {
            throw new Error("Nome do arquivo não informado.");
        }
        const jid = `${numero}@s.whatsapp.net`;
        const mime = mimeType.toLowerCase();
        console.log("📤 GestãoM → WhatsApp: enviando arquivo");
        console.log("Telefone:", numero);
        console.log("Arquivo:", nomeArquivo);
        console.log("MIME:", mime);
        console.log("Tamanho:", arquivo.length);
        /**
         * ==================================================
         * IMAGEM
         * ==================================================
         */
        if (mime.startsWith("image/")) {
            return this.sock.sendMessage(jid, {
                image: arquivo,
                mimetype: mime,
                caption: texto?.trim() ||
                    undefined,
            });
        }
        /**
         * ==================================================
         * VÍDEO
         * ==================================================
         */
        if (mime.startsWith("video/")) {
            return this.sock.sendMessage(jid, {
                video: arquivo,
                mimetype: mime,
                caption: texto?.trim() ||
                    undefined,
            });
        }
        /**
         * ==================================================
         * ÁUDIO
         * ==================================================
         */
        if (mime.startsWith("audio/")) {
            return this.sock.sendMessage(jid, {
                audio: arquivo,
                mimetype: mime,
                ptt: false,
            });
        }
        /**
         * ==================================================
         * DOCUMENTO
         * ==================================================
         */
        return this.sock.sendMessage(jid, {
            document: arquivo,
            mimetype: mime,
            fileName: nomeArquivo,
            caption: texto?.trim() ||
                undefined,
        });
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
            conectado: this.conectado,
            qrCode: this.qrCode,
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
        }
        catch (error) {
            console.error("Erro ao desconectar WhatsApp:", error);
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
exports.whatsappClient = new WhatsAppClient();
