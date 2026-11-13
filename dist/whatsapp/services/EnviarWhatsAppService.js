"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WhatsAppClient_1 = require("../client/WhatsAppClient");
class EnviarWhatsAppService {
    async execute(telefone, texto, arquivo, mimeType, nomeArquivo) {
        if (!telefone) {
            throw new Error("Telefone não informado.");
        }
        if (arquivo) {
            if (!mimeType) {
                throw new Error("Tipo MIME do arquivo não informado.");
            }
            if (!nomeArquivo) {
                throw new Error("Nome do arquivo não informado.");
            }
            return WhatsAppClient_1.whatsappClient.enviarArquivo(telefone, arquivo, mimeType, nomeArquivo, texto);
        }
        if (!texto?.trim()) {
            throw new Error("Texto da mensagem não informado.");
        }
        return WhatsAppClient_1.whatsappClient.enviarTexto(telefone, texto.trim());
    }
    /**
     * Edita uma mensagem já enviada pelo WhatsApp.
     */
    async editarMensagem(telefone, whatsappId, texto) {
        if (!telefone) {
            throw new Error("Telefone não informado.");
        }
        if (!whatsappId) {
            throw new Error("ID da mensagem do WhatsApp não informado.");
        }
        if (!texto?.trim()) {
            throw new Error("O texto da mensagem não pode ser vazio.");
        }
        return WhatsAppClient_1.whatsappClient.editarMensagem(telefone, whatsappId, texto.trim());
    }
    /**
     * Apaga uma mensagem já enviada pelo WhatsApp.
     */
    async apagarMensagem(telefone, whatsappId) {
        if (!telefone) {
            throw new Error("Telefone não informado.");
        }
        if (!whatsappId) {
            throw new Error("ID da mensagem do WhatsApp não informado.");
        }
        return WhatsAppClient_1.whatsappClient.apagarMensagem(telefone, whatsappId);
    }
}
exports.default = new EnviarWhatsAppService();
