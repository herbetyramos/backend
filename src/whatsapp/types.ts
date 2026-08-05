export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: string;
}

export interface WhatsAppChange {
  value: {
    messaging_product: string;
    metadata: {
      phone_number_id: string;
    };
    contacts?: {
      profile: {
        name: string;
      };
        wa_id: string;
    }[];

    messages?: WhatsAppMessage[];
  };
}

export interface WebhookBody {
  object: string;

  entry: {
    changes: WhatsAppChange[];
  }[];
}