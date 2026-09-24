import { whatsappClient } from "../client/WhatsAppClient";

class EnviarWhatsAppService {
  async execute(
    telefone: string,
    texto?: string,
    arquivo?: Buffer,
    mimeType?: string,
    nomeArquivo?: string
  ) {
    if (!telefone) {
      throw new Error("Telefone não informado.");
    }

    if (arquivo) {
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

      return whatsappClient.enviarArquivo(
        telefone,
        arquivo,
        mimeType,
        nomeArquivo,
        texto
      );
    }

    if (!texto?.trim()) {
      throw new Error(
        "Texto da mensagem não informado."
      );
    }

    return whatsappClient.enviarTexto(
      telefone,
      texto.trim()
    );
  }

  /**
   * Edita uma mensagem já enviada pelo WhatsApp.
   */
  async editarMensagem(
    telefone: string,
    whatsappId: string,
    texto: string
  ) {
    if (!telefone) {
      throw new Error(
        "Telefone não informado."
      );
    }

    if (!whatsappId) {
      throw new Error(
        "ID da mensagem do WhatsApp não informado."
      );
    }

    if (!texto?.trim()) {
      throw new Error(
        "O texto da mensagem não pode ser vazio."
      );
    }

    return whatsappClient.editarMensagem(
      telefone,
      whatsappId,
      texto.trim()
    );
  }

  /**
   * Apaga uma mensagem já enviada pelo WhatsApp.
   */
  async apagarMensagem(
    telefone: string,
    whatsappId: string
  ) {
    if (!telefone) {
      throw new Error(
        "Telefone não informado."
      );
    }

    if (!whatsappId) {
      throw new Error(
        "ID da mensagem do WhatsApp não informado."
      );
    }

    return whatsappClient.apagarMensagem(
      telefone,
      whatsappId
    );
  }
}

export default new EnviarWhatsAppService();