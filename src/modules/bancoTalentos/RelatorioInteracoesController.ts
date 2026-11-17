
import { Request, Response } from "express";
import prisma from "../../prisma";

const STATUS_CANDIDATURA = [
  "EM_ANALISE",
  "CONTATADO",
  "SELECIONADO",
  "RECUSADO",
] as const;

type StatusCandidatura = (typeof STATUS_CANDIDATURA)[number];

function obterParametro(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export class RelatorioInteracoesController {
  async handle(req: Request, res: Response) {
    try {
      const empresaId = obterParametro(req.query.empresaId);
      const nomeAluno = obterParametro(req.query.aluno);
      const statusInformado = obterParametro(req.query.status);
      const dataInicio = obterParametro(req.query.dataInicio);
      const dataFim = obterParametro(req.query.dataFim);

      if (
        statusInformado &&
        !STATUS_CANDIDATURA.includes(statusInformado as StatusCandidatura)
      ) {
        return res.status(400).json({
          error: "Status de candidatura inválido.",
        });
      }

      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00`) : null;
      const fim = dataFim ? new Date(`${dataFim}T23:59:59.999`) : null;

      if (
        (inicio && Number.isNaN(inicio.getTime())) ||
        (fim && Number.isNaN(fim.getTime()))
      ) {
        return res.status(400).json({
          error: "Informe um período válido.",
        });
      }

      if (inicio && fim && inicio > fim) {
        return res.status(400).json({
          error: "A data inicial não pode ser posterior à data final.",
        });
      }

      const candidaturas = await prisma.candidatura.findMany({
        where: {
          ...(statusInformado
            ? {
                status: statusInformado as StatusCandidatura,
              }
            : {}),

          ...(nomeAluno
            ? {
                aluno: {
                  nome: {
                    contains: nomeAluno,
                    mode: "insensitive",
                  },
                },
              }
            : {}),

          ...(inicio || fim
            ? {
                createdAt: {
                  ...(inicio ? { gte: inicio } : {}),
                  ...(fim ? { lte: fim } : {}),
                },
              }
            : {}),

          ...(empresaId
            ? {
                oportunidade: {
                  empresaId,
                },
              }
            : {}),
        },

        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,

          aluno: {
            select: {
              id: true,
              nome: true,
            },
          },

          oportunidade: {
            select: {
              id: true,
              titulo: true,

              empresa: {
                select: {
                  id: true,
                  razaoSocial: true,
                  nomeFantasia: true,
                  cnpj: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      const empresasMap = new Map<
        string,
        {
          empresaId: string;
          empresa: {
            id: string;
            razaoSocial: string;
            nomeFantasia: string | null;
            cnpj: string;
          };
          totalCandidaturas: number;
          candidaturas: Array<{
            id: string;
            alunoId: string;
            aluno: string;
            oportunidadeId: string;
            oportunidade: string;
            dataCandidatura: Date;
            ultimaAtualizacao: Date;
            status: StatusCandidatura;
          }>;
        }
      >();

      for (const candidatura of candidaturas) {
        const empresa = candidatura.oportunidade.empresa;

        if (!empresasMap.has(empresa.id)) {
          empresasMap.set(empresa.id, {
            empresaId: empresa.id,
            empresa: {
              id: empresa.id,
              razaoSocial: empresa.razaoSocial,
              nomeFantasia: empresa.nomeFantasia,
              cnpj: empresa.cnpj,
            },
            totalCandidaturas: 0,
            candidaturas: [],
          });
        }

        const grupo = empresasMap.get(empresa.id)!;

        grupo.candidaturas.push({
          id: candidatura.id,
          alunoId: candidatura.aluno.id,
          aluno: candidatura.aluno.nome,
          oportunidadeId: candidatura.oportunidade.id,
          oportunidade: candidatura.oportunidade.titulo,
          dataCandidatura: candidatura.createdAt,
          ultimaAtualizacao: candidatura.updatedAt,
          status: candidatura.status,
        });

        grupo.totalCandidaturas += 1;
      }

      const resultado = Array.from(empresasMap.values()).sort((a, b) => {
        const nomeA =
          a.empresa.nomeFantasia || a.empresa.razaoSocial;

        const nomeB =
          b.empresa.nomeFantasia || b.empresa.razaoSocial;

        return nomeA.localeCompare(nomeB, "pt-BR");
      });

      return res.json({
        totalEmpresas: resultado.length,
        totalCandidaturas: candidaturas.length,
        empresas: resultado,
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de interações:", error);

      return res.status(500).json({
        error: "Não foi possível gerar o relatório de interações.",
      });
    }
  }
}
