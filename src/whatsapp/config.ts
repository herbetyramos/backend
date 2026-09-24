
export const WHATSAPP = {

  /**
   * Diretório onde a sessão do WhatsApp
   * será armazenada.
   *
   * Não será necessário escanear o QR Code
   * novamente após reiniciar o servidor,
   * enquanto a sessão continuar válida.
   */
  AUTH_PATH:
    process.env.WHATSAPP_AUTH_PATH ||
    "whatsapp_auth",

  /**
   * Nome utilizado para identificar
   * o dispositivo conectado.
   */
  DEVICE_NAME:
    process.env.WHATSAPP_DEVICE_NAME ||
    "GestaoM",

  /**
   * Delay para tentar reconectar
   * caso o WhatsApp seja desconectado.
   */
  RECONNECT_DELAY:
    Number(
      process.env.WHATSAPP_RECONNECT_DELAY ||
      3000
    ),

  /**
   * Tempo máximo de espera para
   * operações com o WhatsApp.
   */
  TIMEOUT:
    Number(
      process.env.WHATSAPP_TIMEOUT ||
      30000
    ),

};

