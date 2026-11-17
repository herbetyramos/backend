import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prisma from "../prisma";

interface PayloadEmpresa {
  sub: string;
  tipo?: string;
  empresaId?: string;
}

export async function IsEmpresaAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Faça login para continuar." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token inválido." });
  }

  let payload: PayloadEmpresa;

  try {
    payload = verify(
      token,
      process.env.JWS_SECRET as string
    ) as PayloadEmpresa;
  } catch {
    return res.status(401).json({ error: "Sessão expirada. Entre novamente." });
  }

  if (payload.tipo !== "empresa" || !payload.sub || !payload.empresaId) {
    return res.status(403).json({ error: "Acesso exclusivo de empresas empregadoras." });
  }

  // Revalida usuário, vínculo e aprovação em cada requisição protegida.
  // Assim, suspensão, reprovação ou desativação revoga o acesso imediatamente.
  const usuario = await prisma.usuarioEmpresaParceira.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      empresaId: true,
      ativo: true,
      empresa: {
        select: {
          status: true,
        },
      },
    },
  });

  if (
    !usuario ||
    !usuario.ativo ||
    usuario.empresaId !== payload.empresaId ||
    usuario.empresa.status !== "APROVADA"
  ) {
    return res.status(403).json({ error: "Acesso empresarial não autorizado." });
  }

  req.empresa_usuario_id = usuario.id;
  req.empresa_id = usuario.empresaId;

  return next();
}
