
import prismaClient from "../../prisma";

interface Planejamento {
  id: string;
  conteudo: string;
}

interface Request {
  planejamentos: Planejamento[];
}

const MENSAGEM_BLOQUEIO =
  "O prazo para edição do planejamento terminou. O curso já atingiu a data de início.";

function obterChaveData(data: string): string | null {
  const valor = data.trim();

  let ano: number;
  let mes: number;
  let dia: number;

  const formatoISO = valor.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (formatoISO) {
    ano = Number(formatoISO[1]);
    mes = Number(formatoISO[2]);
    dia = Number(formatoISO[3]);
  } else {
    const formatoBR = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (!formatoBR) {
      return null;
    }

    dia = Number(formatoBR[1]);
    mes = Number(formatoBR[2]);
    ano = Number(formatoBR[3]);
  }

  const dataValidada = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    dataValidada.getUTCFullYear() !== ano ||
    dataValidada.getUTCMonth() !== mes - 1 ||
    dataValidada.getUTCDate() !== dia
  ) {
    return null;
  }

  return `${ano}${String(mes).padStart(2, "0")}${String(dia).padStart(2, "0")}`;
}

function obterHojeBrasilia(): string {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const valores = Object.fromEntries(
    partes.map((parte) => [parte.type, parte.value])
  );

  return `${valores.year}${valores.month}${valores.day}`;
}

class SalvarTudoPlanejamentoService {
  async execute({ planejamentos }: Request) {
    if (!Array.isArray(planejamentos) || planejamentos.length === 0) {
      return {
        bloqueado: true as const,
        message: "Nenhum planejamento foi informado.",
      };
    }

    if (
      planejamentos.some(
        (item) =>
          !item.id ||
          typeof item.conteudo !== "string"
      )
    ) {
      return {
        bloqueado: true as const,
        message: "Os dados do planejamento são inválidos.",
      };
    }

    const ids = planejamentos.map((item) => item.id);

    if (new Set(ids).size !== ids.length) {
      return {
        bloqueado: true as const,
        message: "Existem registros duplicados no planejamento.",
      };
    }

    const registros = await prismaClient.planejamentoAula.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        planeja_id: true,
        curso_programado: {
          select: {
            data_inicio: true,
          },
        },
      },
    });

    if (registros.length !== ids.length) {
      return {
        bloqueado: true as const,
        message: "Um ou mais registros do planejamento não foram encontrados.",
      };
    }

    const cronogramas = new Set(
      registros.map((item) => item.planeja_id)
    );

    if (cronogramas.size !== 1) {
      return {
        bloqueado: true as const,
        message: "Não é permitido salvar planejamentos de cursos diferentes juntos.",
      };
    }

    const dataInicio = obterChaveData(
      registros[0].curso_programado.data_inicio
    );

    if (!dataInicio) {
      return {
        bloqueado: true as const,
        message: "A data de início do curso é inválida.",
      };
    }

    const hoje = obterHojeBrasilia();

    // O próprio dia de início já fica bloqueado.
    if (hoje >= dataInicio) {
      return {
        bloqueado: true as const,
        message: MENSAGEM_BLOQUEIO,
      };
    }

    await prismaClient.$transaction(
      planejamentos.map((item) =>
        prismaClient.planejamentoAula.update({
          where: {
            id: item.id,
          },
          data: {
            conteudo: item.conteudo,
            finalizado: true,
          },
        })
      )
    );

    return {
      message: "Planejamento salvo com sucesso.",
    };
  }
}

export { SalvarTudoPlanejamentoService };
