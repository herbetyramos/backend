"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLocalController = void 0;
const ListServiceLocal_1 = require("../../services/local/ListServiceLocal");
class ListLocalController {
    async handle(req, res) {
        const listServiceLocal = new ListServiceLocal_1.ListServiceLocal();
        const local = await listServiceLocal.execute();
        return res.json(local);
    }
}
exports.ListLocalController = ListLocalController;
