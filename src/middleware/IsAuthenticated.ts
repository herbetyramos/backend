import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
  tipo?: string;
}

export function IsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Não autenticado." });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token inválido." });
  }

  try {
    const payload = verify(
      token,
      process.env.JWS_SECRET as string
    ) as Payload;

    if (!payload.sub) {
      return res.status(401).json({ error: "Token inválido." });
    }

    // Compatibilidade: tokens administrativos antigos não possuem "tipo".
    // Novos tokens administrativos usam tipo="admin".
    // Tokens de aluno e empresa nunca podem acessar rotas administrativas.
    if (payload.tipo !== undefined && payload.tipo !== "admin") {
      return res.status(403).json({ error: "Acesso administrativo não permitido." });
    }

    req.user_id = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
