import { Router } from "express";
import WebhookController from "./controllers/WebhookController";

const router = Router();

router.get("/webhook", WebhookController.verify);

router.post("/webhook", WebhookController.receive);

export default router;