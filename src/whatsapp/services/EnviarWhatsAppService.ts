import { WhatsAppClient } from "../client/WhatsAppClient";

class EnviarWhatsAppService {

  private client = new WhatsAppClient();

  async execute(
    telefone: string,
    texto: string
  ) {
    return await this.client.enviarTexto(
      telefone,
      texto
    );
  }

}

export default new EnviarWhatsAppService();