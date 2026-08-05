import { Request, Response } from "express";
import ReceberWhatsAppService from "../services/ReceberWhatsAppService";
import { WHATSAPP } from "../config";

class WebhookController {

    verify(req: Request, res: Response) {

        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (
            mode === "subscribe" &&
            token === WHATSAPP.VERIFY_TOKEN
        ) {

            return res.status(200).send(challenge);

        }

        return res.sendStatus(403);

    }

    async receive(req: Request, res: Response) {

        await ReceberWhatsAppService.execute(req.body);

        return res.sendStatus(200);

    }

}

export default new WebhookController();