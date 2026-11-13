"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocalController = void 0;
const CreateServiceLocal_1 = require("../../services/local/CreateServiceLocal");
class CreateLocalController {
    async handle(req, res) {
        const { polo, Telefone, Telefone2 } = req.body;
        const createLocalController = new CreateServiceLocal_1.CreateServiceLocal();
        const local = await createLocalController.execute({
            polo, Telefone, Telefone2
        });
        return res.json(local);
    }
}
exports.CreateLocalController = CreateLocalController;
