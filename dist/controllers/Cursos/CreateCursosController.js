"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCursosController = void 0;
const CreateCursosService_1 = require("../../services/cursos/CreateCursosService");
class CreateCursosController {
    async handle(req, res) {
        const { nome_curso, price, description, segmento_id } = req.body;
        const createCursosService = new CreateCursosService_1.CreateCursosService();
        if (!req.file) {
            throw new Error("error upload file");
        }
        else {
            const { originalname, filename: banner } = req.file;
            const cursos = await createCursosService.execute({
                nome_curso,
                price,
                description,
                segmento_id,
                banner,
            });
            return res.json(cursos);
        }
    }
}
exports.CreateCursosController = CreateCursosController;
