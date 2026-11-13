"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFormaturaController = void 0;
const CreateServiceFormatura_1 = require("../../services/formatura/CreateServiceFormatura");
class CreateFormaturaController {
    async handle(req, res) {
        const { data_formatura, local } = req.body;
        const createFormaturaController = new CreateServiceFormatura_1.CreateServiceFormatura();
        const formatura = await createFormaturaController.execute({
            local, data_formatura
        });
        return res.json(formatura);
    }
}
exports.CreateFormaturaController = CreateFormaturaController;
