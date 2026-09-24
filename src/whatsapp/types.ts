
/**
 * ============================================================
 * MENSAGEM RECEBIDA DO WHATSAPP
 * ============================================================
 *
 * Dados normalizados pelo WhatsAppClient antes de serem
 * enviados para o ReceberWhatsAppService.
 */
export interface WhatsAppMessage {
  /**
   * Número do remetente.
   *
   * Exemplo:
   * 5511999999999
   */
  telefone: string;

  /**
   * Nome do contato.
   */
  nome: string;

  /**
   * Texto da mensagem.
   */
  texto: string;

  /**
   * ID da mensagem no WhatsApp.
   *
   * Pode ser utilizado futuramente para impedir
   * mensagens duplicadas.
   */
  messageId?: string;

  /**
   * Timestamp da mensagem no WhatsApp.
   */
  timestamp?: number;
}


/**
 * ============================================================
 * DADOS PARA ENVIO
 * ============================================================
 */
export interface WhatsAppSendMessage {
  /**
   * Número de destino.
   *
   * Exemplo:
   * 5511999999999
   */
  telefone: string;

  /**
   * Texto que será enviado.
   */
  texto: string;
}


/**
 * ============================================================
 * STATUS DO WHATSAPP
 * ============================================================
 */
export interface WhatsAppStatus {
  /**
   * Indica se o WhatsApp está conectado.
   */
  conectado: boolean;

  /**
   * QR Code em formato Data URL.
   *
   * Será null quando o WhatsApp estiver conectado
   * ou quando ainda não existir um QR Code disponível.
   */
  qrCode: string | null;
}


/**
 * ============================================================
 * RESPOSTA DO ENVIO
 * ============================================================
 */
export interface WhatsAppSendResult {
  /**
   * Identificador da mensagem enviada.
   */
  messageId?: string;

  /**
   * JID utilizado pelo WhatsApp.
   */
  jid?: string;
}

