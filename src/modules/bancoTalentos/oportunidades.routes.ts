
import { Router, Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import {
  StatusOportunidade,
  StatusCandidatura,
} from "@prisma/client";

import prisma from "../../prisma";
import { IsEmpresaAuthenticated } from "../../middleware/IsEmpresaAuthenticated";

const router = Router();

const TOKEN_SECRET = process.env.JWS_SECRET as string;

type CorpoRequisicao = Record<string, unknown>;

function texto(valor: unknown): string {
  return String(valor ?? "").trim();
}

function textoOpcional(valor: unknown): string | null {
  return texto(valor) || null;
}

function IsAlunoAuthenticated(
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

  try {
    const payload = verify(token, TOKEN_SECRET) as {
      sub: string;
      tipo?: string;
    };

    if (payload.tipo !== "aluno" || !payload.sub) {
      return res.status(403).json({
        error: "Acesso exclusivo do aluno.",
      });
    }

    req.aluno_id = payload.sub;

    return next();
  } catch {
    return res.status(401).json({
      error: "Sessão expirada. Entre novamente.",
    });
  }
}

async function alunoElegivel(alunoId: string): Promise<boolean> {
  const aluno = await prisma.aluno.findFirst({
    where: {
      id: alunoId,
      matriculas: {
        some: {
          aprovado: true,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(aluno);
}

// =====================================================
// EMPRESA: CRIAR OPORTUNIDADE
// =====================================================

router.post(
  "/banco-talentos/empresas/oportunidades",
  IsEmpresaAuthenticated,
  async (
    req: Request<Record<string, string>, unknown, CorpoRequisicao>,
    res: Response
  ) => {
    const titulo = texto(req.body.titulo);
    const descricao = texto(req.body.descricao);

    if (!titulo || !descricao) {
      return res.status(400).json({
        error: "Informe o título e a descrição da oportunidade.",
      });
    }

    const salarioInformado = req.body.salario;
    const salario =
      salarioInformado === undefined ||
      salarioInformado === null ||
      salarioInformado === ""
        ? null
        : Number(salarioInformado);

    if (
      salario !== null &&
      (!Number.isFinite(salario) || salario < 0)
    ) {
      return res.status(400).json({
        error: "Informe um valor válido para o salário.",
      });
    }

    const prazoInformado = texto(req.body.prazoCandidatura);
    const prazoCandidatura = prazoInformado
      ? new Date(prazoInformado)
      : null;

    if (
      prazoCandidatura &&
      Number.isNaN(prazoCandidatura.getTime())
    ) {
      return res.status(400).json({
        error: "Informe um prazo de candidatura válido.",
      });
    }

    const oportunidade = await prisma.oportunidade.create({
      data: {
        empresaId: req.empresa_id,
        titulo,
        descricao,
        requisitos: textoOpcional(req.body.requisitos),
        atividades: textoOpcional(req.body.atividades),
        cidade: textoOpcional(req.body.cidade),
        modalidade: textoOpcional(req.body.modalidade),
        tipoContratacao: textoOpcional(req.body.tipoContratacao),
        jornada: textoOpcional(req.body.jornada),
        salario,
        beneficios: textoOpcional(req.body.beneficios),
        prazoCandidatura,
        status: "RASCUNHO",
      },
    });

    return res.status(201).json(oportunidade);
  }
);

// =====================================================
// EMPRESA: LISTAR SUAS OPORTUNIDADES
// =====================================================

router.get(
  "/banco-talentos/empresas/oportunidades",
  IsEmpresaAuthenticated,
  async (req: Request, res: Response) => {
    const oportunidades = await prisma.oportunidade.findMany({
      where: {
        empresaId: req.empresa_id,
      },
      include: {
        _count: {
          select: {
            candidaturas: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(oportunidades);
  }
);

// =====================================================
// EMPRESA: EDITAR OPORTUNIDADE
// =====================================================

router.patch(
  "/banco-talentos/empresas/oportunidades/:id",
  IsEmpresaAuthenticated,
  async (
    req: Request<{ id: string }, unknown, CorpoRequisicao>,
    res: Response
  ) => {
    const oportunidade = await prisma.oportunidade.findFirst({
      where: {
        id: req.params.id,
        empresaId: req.empresa_id,
      },
    });

    if (!oportunidade) {
      return res.status(404).json({
        error: "Oportunidade não encontrada.",
      });
    }

    if (oportunidade.status === "ENCERRADA") {
      return res.status(400).json({
        error: "Não é possível editar uma oportunidade encerrada.",
      });
    }

    const data: {
      titulo?: string;
      descricao?: string;
      requisitos?: string | null;
      atividades?: string | null;
      cidade?: string | null;
      modalidade?: string | null;
      tipoContratacao?: string | null;
      jornada?: string | null;
      salario?: number | null;
      beneficios?: string | null;
      prazoCandidatura?: Date | null;
    } = {};

    if (req.body.titulo !== undefined) {
      data.titulo = texto(req.body.titulo);
    }

    if (req.body.descricao !== undefined) {
      data.descricao = texto(req.body.descricao);
    }

    if (req.body.requisitos !== undefined) {
      data.requisitos = textoOpcional(req.body.requisitos);
    }

    if (req.body.atividades !== undefined) {
      data.atividades = textoOpcional(req.body.atividades);
    }

    if (req.body.cidade !== undefined) {
      data.cidade = textoOpcional(req.body.cidade);
    }

    if (req.body.modalidade !== undefined) {
      data.modalidade = textoOpcional(req.body.modalidade);
    }

    if (req.body.tipoContratacao !== undefined) {
      data.tipoContratacao = textoOpcional(req.body.tipoContratacao);
    }

    if (req.body.jornada !== undefined) {
      data.jornada = textoOpcional(req.body.jornada);
    }

    if (req.body.beneficios !== undefined) {
      data.beneficios = textoOpcional(req.body.beneficios);
    }

    if (req.body.salario !== undefined) {
      const valor = req.body.salario;
      const salario =
        valor === null || valor === "" ? null : Number(valor);

      if (
        salario !== null &&
        (!Number.isFinite(salario) || salario < 0)
      ) {
        return res.status(400).json({
          error: "Informe um salário válido.",
        });
      }

      data.salario = salario;
    }

    if (req.body.prazoCandidatura !== undefined) {
      const prazo = texto(req.body.prazoCandidatura);
      const dataPrazo = prazo ? new Date(prazo) : null;

      if (dataPrazo && Number.isNaN(dataPrazo.getTime())) {
        return res.status(400).json({
          error: "Informe um prazo de candidatura válido.",
        });
      }

      data.prazoCandidatura = dataPrazo;
    }

    if (data.titulo !== undefined && !data.titulo) {
      return res.status(400).json({
        error: "O título não pode ficar vazio.",
      });
    }

    if (data.descricao !== undefined && !data.descricao) {
      return res.status(400).json({
        error: "A descrição não pode ficar vazia.",
      });
    }

    const atualizada = await prisma.oportunidade.update({
      where: {
        id: oportunidade.id,
      },
      data,
    });

    return res.json(atualizada);
  }
);

// =====================================================
// EMPRESA: PUBLICAR OU ENCERRAR OPORTUNIDADE
// =====================================================

router.patch(
  "/banco-talentos/empresas/oportunidades/:id/status",
  IsEmpresaAuthenticated,
  async (
    req: Request<{ id: string }, unknown, CorpoRequisicao>,
    res: Response
  ) => {
    const status = texto(req.body.status);

    const permitidos: StatusOportunidade[] = [
      "RASCUNHO",
      "PUBLICADA",
      "ENCERRADA",
    ];

    if (!permitidos.includes(status as StatusOportunidade)) {
      return res.status(400).json({
        error: "Status de oportunidade inválido.",
      });
    }

    const oportunidade = await prisma.oportunidade.findFirst({
      where: {
        id: req.params.id,
        empresaId: req.empresa_id,
      },
    });

    if (!oportunidade) {
      return res.status(404).json({
        error: "Oportunidade não encontrada.",
      });
    }

    if (
      oportunidade.status === "ENCERRADA" &&
      status !== "ENCERRADA"
    ) {
      return res.status(400).json({
        error: "Uma oportunidade encerrada não pode ser reaberta.",
      });
    }

    const atualizada = await prisma.oportunidade.update({
      where: {
        id: oportunidade.id,
      },
      data: {
        status: status as StatusOportunidade,
      },
    });

    return res.json(atualizada);
  }
);

// =====================================================
// EMPRESA: CONSULTAR PERFIS PROFISSIONAIS
// Sem telefone, e-mail ou currículo
// =====================================================

router.get(
  "/banco-talentos/empresas/perfis",
  IsEmpresaAuthenticated,
  async (_req: Request, res: Response) => {
    const perfis = await prisma.perfilProfissional.findMany({
      where: {
        ativo: true,
        aluno: {
          matriculas: {
            some: {
              aprovado: true,
            },
          },
        },
      },
      select: {
        id: true,
        objetivoProfissional: true,
        resumo: true,
        cidade: true,
        bairro: true,
        disponibilidade: true,
        aluno: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json(perfis);
  }
);

// =====================================================
// ALUNO: CONSULTAR OPORTUNIDADES PUBLICADAS
// =====================================================

router.get(
  "/banco-talentos/aluno/oportunidades",
  IsAlunoAuthenticated,
  async (req: Request, res: Response) => {
    const elegivel = await alunoElegivel(req.aluno_id);

    if (!elegivel) {
      return res.status(403).json({
        error: "Aluno não possui matrícula aprovada.",
      });
    }

    const agora = new Date();

    const oportunidades = await prisma.oportunidade.findMany({
      where: {
        status: "PUBLICADA",
        OR: [
          {
            prazoCandidatura: null,
          },
          {
            prazoCandidatura: {
              gte: agora,
            },
          },
        ],
      },
      include: {
        empresa: {
          select: {
            razaoSocial: true,
            nomeFantasia: true,
            cidade: true,
          },
        },
        candidaturas: {
          where: {
            alunoId: req.aluno_id,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(oportunidades);
  }
);

// =====================================================
// ALUNO: CANDIDATAR-SE A UMA OPORTUNIDADE
// =====================================================

router.post(
  "/banco-talentos/aluno/oportunidades/:id/candidatar",
  IsAlunoAuthenticated,
  async (req: Request<{ id: string }>, res: Response) => {
    const elegivel = await alunoElegivel(req.aluno_id);

    if (!elegivel) {
      return res.status(403).json({
        error: "Aluno não possui matrícula aprovada.",
      });
    }

    const oportunidade = await prisma.oportunidade.findFirst({
      where: {
        id: req.params.id,
        status: "PUBLICADA",
        OR: [
          {
            prazoCandidatura: null,
          },
          {
            prazoCandidatura: {
              gte: new Date(),
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!oportunidade) {
      return res.status(404).json({
        error: "Oportunidade não encontrada ou fora do prazo de candidatura.",
      });
    }

    const existente = await prisma.candidatura.findUnique({
      where: {
        oportunidadeId_alunoId: {
          oportunidadeId: oportunidade.id,
          alunoId: req.aluno_id,
        },
      },
    });

    if (existente) {
      return res.status(409).json({
        error: "Você já se candidatou a esta oportunidade.",
      });
    }

    const candidatura = await prisma.candidatura.create({
      data: {
        oportunidadeId: oportunidade.id,
        alunoId: req.aluno_id,
      },
    });

    return res.status(201).json(candidatura);
  }
);

// =====================================================
// ALUNO: CONSULTAR SUAS CANDIDATURAS
// =====================================================

router.get(
  "/banco-talentos/aluno/candidaturas",
  IsAlunoAuthenticated,
  async (req: Request, res: Response) => {
    const elegivel = await alunoElegivel(req.aluno_id);

    if (!elegivel) {
      return res.status(403).json({
        error: "Aluno não possui matrícula aprovada.",
      });
    }

    const candidaturas = await prisma.candidatura.findMany({
      where: {
        alunoId: req.aluno_id,
      },
      include: {
        oportunidade: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            cidade: true,
            modalidade: true,
            tipoContratacao: true,
            status: true,
            empresa: {
              select: {
                razaoSocial: true,
                nomeFantasia: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(candidaturas);
  }
);

// =====================================================
// EMPRESA: LISTAR CANDIDATOS DE UMA OPORTUNIDADE
// Contato e currículo liberados após candidatura
// =====================================================

// =====================================================
// EMPRESA: LISTAR CANDIDATOS DE UMA OPORTUNIDADE
// Contato, currículo e cursos aprovados do aluno
// =====================================================

router.get(
  "/banco-talentos/empresas/oportunidades/:id/candidatos",
  IsEmpresaAuthenticated,
  async (req: Request<{ id: string }>, res: Response) => {
    const oportunidade = await prisma.oportunidade.findFirst({
      where: {
        id: req.params.id,
        empresaId: req.empresa_id,
      },
      select: {
        id: true,
      },
    });

    if (!oportunidade) {
      return res.status(404).json({
        error: "Oportunidade não encontrada.",
      });
    }

    const candidaturas = await prisma.candidatura.findMany({
      where: {
        oportunidadeId: oportunidade.id,
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            email: true,
            celular: true,

            // Histórico de cursos aprovados
            matriculas: {
              where: {
                aprovado: true,
              },
              select: {
                id: true,
                cronograma: {
                  select: {
                    tema: true,
                    data_fim: true,
                  },
                },
              },
              orderBy: {
                created_at: "desc",
              },
            },

            perfilProfissional: {
              select: {
                objetivoProfissional: true,
                resumo: true,
                cidade: true,
                bairro: true,
                disponibilidade: true,
                telefoneContato: true,
                curriculoUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(candidaturas);
  }
);

// =====================================================
// EMPRESA: ATUALIZAR STATUS DA CANDIDATURA
// =====================================================

router.patch(
  "/banco-talentos/empresas/candidaturas/:id/status",
  IsEmpresaAuthenticated,
  async (
    req: Request<{ id: string }, unknown, CorpoRequisicao>,
    res: Response
  ) => {
    const status = texto(req.body.status);

    const permitidos: StatusCandidatura[] = [
      "EM_ANALISE",
      "CONTATADO",
      "SELECIONADO",
      "RECUSADO",
    ];

    if (!permitidos.includes(status as StatusCandidatura)) {
      return res.status(400).json({
        error: "Status de candidatura inválido.",
      });
    }

    const candidatura = await prisma.candidatura.findFirst({
      where: {
        id: req.params.id,
        oportunidade: {
          empresaId: req.empresa_id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!candidatura) {
      return res.status(404).json({
        error: "Candidatura não encontrada.",
      });
    }

    const atualizada = await prisma.candidatura.update({
      where: {
        id: candidatura.id,
      },
      data: {
        status: status as StatusCandidatura,
      },
    });

    return res.json(atualizada);
  }
);

export { router as oportunidadesRoutes };
