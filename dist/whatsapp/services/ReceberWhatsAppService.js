"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma"));
const socket_1 = require("../../socket");
class ReceberWhatsAppService {
    normalizarTelefone(telefone) {
        return telefone.replace(/\D/g, "");
    }
    formatosTelefone(telefone) {
        const telefoneLimpo = this.normalizarTelefone(telefone);
        const formatos = new Set();
        if (telefoneLimpo) {
            formatos.add(telefoneLimpo);
        }
        if (telefoneLimpo.startsWith("55") &&
            telefoneLimpo.length > 11) {
            formatos.add(telefoneLimpo.substring(2));
        }
        return Array.from(formatos);
    }
    async buscarOuCriarConversa(telefone, nome, ultimaMensagem) {
        const formatos = this.formatosTelefone(telefone);
        const conversas = await prisma_1.default.conversa.findMany({
            where: {
                telefone: {
                    in: formatos,
                },
            },
            orderBy: {
                ultimaData: "desc",
            },
        });
        if (conversas.length > 0) {
            const conversa = conversas.find((item) => item.aluno_id) ?? conversas[0];
            if (nome &&
                conversa.nome !== nome) {
                const conversaAtualizada = await prisma_1.default.conversa.update({
                    where: {
                        id: conversa.id,
                    },
                    data: {
                        nome,
                    },
                });
                return {
                    conversa: conversaAtualizada,
                    criada: false,
                };
            }
            return {
                conversa,
                criada: false,
            };
        }
        const telefoneNormalizado = this.normalizarTelefone(telefone);
        const novaConversa = await prisma_1.default.conversa.create({
            data: {
                telefone: telefoneNormalizado,
                nome,
                ultimaMensagem,
                ultimaData: new Date(),
            },
        });
        return {
            conversa: novaConversa,
            criada: true,
        };
    }
    async salvarMensagem(conversaId, dados) {
        return prisma_1.default.mensagem.create({
            data: {
                conversaId,
                texto: dados.texto,
                tipo: dados.tipo,
                nomeArquivo: dados.nomeArquivo ?? null,
                mimeType: dados.mimeType ?? null,
                tamanho: dados.tamanho ?? null,
                arquivoUrl: dados.arquivoUrl ?? null,
                whatsappId: dados.whatsappId ?? null,
                enviado: false,
                lida: false,
                status: "DELIVERED",
            },
        });
    }
    async atualizarConversa(conversaId, texto) {
        return prisma_1.default.conversa.update({
            where: {
                id: conversaId,
            },
            data: {
                ultimaMensagem: texto,
                ultimaData: new Date(),
            },
        });
    }
    async execute({ telefone, nome, texto, tipo = "TEXTO", nomeArquivo = null, mimeType = null, tamanho = null, arquivoUrl = null, whatsappId = null, }) {
        try {
            if (!telefone) {
                console.warn("Mensagem WhatsApp sem telefone. Ignorada.");
                return;
            }
            const telefoneNormalizado = this.normalizarTelefone(telefone);
            if (!telefoneNormalizado) {
                console.warn("Telefone WhatsApp inválido. Ignorado.", {
                    telefone,
                });
                return;
            }
            const nomeNormalizado = nome?.trim() ||
                telefoneNormalizado;
            let textoFinal = texto?.trim() ?? "";
            /*
             * Quando não existe texto/caption,
             * usamos uma descrição amigável.
             */
            if (!textoFinal) {
                switch (tipo) {
                    case "IMAGEM":
                        textoFinal = "📷 Imagem";
                        break;
                    case "DOCUMENTO":
                        textoFinal =
                            nomeArquivo
                                ? `📄 ${nomeArquivo}`
                                : "📄 Documento";
                        break;
                    case "AUDIO":
                        textoFinal = "🎵 Áudio";
                        break;
                    case "VIDEO":
                        textoFinal = "🎥 Vídeo";
                        break;
                    default:
                        textoFinal = "📎 Arquivo";
                        break;
                }
            }
            console.log("========================================");
            console.log("WHATSAPP → GESTAOM");
            console.log("Telefone:", telefoneNormalizado);
            console.log("Nome:", nomeNormalizado);
            console.log("Tipo:", tipo);
            console.log("Texto:", textoFinal);
            console.log("Arquivo:", nomeArquivo ?? "nenhum");
            console.log("MIME:", mimeType ?? "nenhum");
            console.log("Tamanho:", tamanho ?? "não informado");
            console.log("URL:", arquivoUrl ?? "nenhuma");
            console.log("WhatsApp ID:", whatsappId ?? "nenhum");
            console.log("========================================");
            const resultado = await this.buscarOuCriarConversa(telefoneNormalizado, nomeNormalizado, textoFinal);
            const conversa = resultado.conversa;
            const conversaNova = resultado.criada;
            if (!conversa) {
                throw new Error("Não foi possível localizar a conversa.");
            }
            console.log("💬 Conversa encontrada:", conversa.id);
            console.log("👤 Aluno vinculado:", conversa.aluno_id ?? "nenhum");
            console.log("🆕 Conversa nova:", conversaNova);
            const novaMensagem = await this.salvarMensagem(conversa.id, {
                texto: textoFinal,
                tipo,
                nomeArquivo,
                mimeType,
                tamanho,
                arquivoUrl,
                whatsappId,
            });
            const conversaAtualizada = await this.atualizarConversa(conversa.id, textoFinal);
            const io = (0, socket_1.getIO)();
            io.emit("novaMensagem", novaMensagem);
            io.emit("conversaAtualizada", {
                conversaId: conversaAtualizada.id,
                ultimaMensagem: conversaAtualizada.ultimaMensagem,
                ultimaData: conversaAtualizada.ultimaData,
            });
            console.log("📩 WhatsApp → GestãoM:", {
                conversaId: conversa.id,
                telefone: telefoneNormalizado,
                nome: nomeNormalizado,
                tipo,
                texto: textoFinal,
                arquivoUrl,
            });
            /*
             * MENSAGEM AUTOMÁTICA DESATIVADA TEMPORARIAMENTE.
             *
             * O sistema continua:
             * - recebendo mensagens;
             * - salvando no banco;
             * - salvando arquivos;
             * - emitindo pelo Socket.IO;
             * - atualizando a conversa.
             *
             * Nenhuma resposta automática será enviada
             * para o WhatsApp.
             */
            return novaMensagem;
        }
        catch (error) {
            console.error("❌ Erro ao receber mensagem do WhatsApp:", error);
            throw error;
        }
    }
}
exports.default = new ReceberWhatsAppService();
