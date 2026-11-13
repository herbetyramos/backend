"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAuthenticated = IsAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
function IsAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Não autenticado." });
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Token inválido." });
    }
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWS_SECRET);
        if (payload.tipo === "aluno") {
            return res.status(403).json({ error: "Acesso administrativo não permitido." });
        }
        req.user_id = payload.sub;
        return next();
    }
    catch {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
}
