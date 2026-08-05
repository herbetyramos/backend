import axios from "axios";
import { WHATSAPP } from "../config";

export class WhatsAppClient {

  async enviarTexto(
    telefone: string,
    texto: string
  ) {

    const response = await axios.post(
      `https://graph.facebook.com/${WHATSAPP.VERSION}/${WHATSAPP.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: telefone,
        type: "text",
        text: {
          body: texto
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP.TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  }

}