import prismaClient from "../../prisma";

class GetRelatorioSaldoDetentoraService {
  async execute() {
    const detentoras = await prismaClient.detentora.findMany({
      include: {
        curso: {
          select: {
            id: true,
            nome_curso: true,
          },
        },

        ata: {
          include: {
            empresa: {
              select: {
                nome_empresa: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          ata: {
            empresa: {
              nome_empresa: "asc",
            },
          },
        },
        {
          curso: {
            nome_curso: "asc",
          },
        },
      ],
    });

    const utilizadasPorDetentora =
      await prismaClient.cronogramaCurso.groupBy({
        by: ["detentoras_id"],
        where: {
          detentoras_id: {
            not: null,
          },
          is_status: {
            not: "CANCELADO",
          },
        },
        _count: {
          _all: true,
        },
      });

    const mapaUtilizadas = new Map(
      utilizadasPorDetentora.map((item) => [
        item.detentoras_id,
        item._count._all,
      ])
    );

    const dados = detentoras.map((detentora) => {
      const contratado = detentora.quantidade_turma ?? 0;

      const utilizadas =
        mapaUtilizadas.get(detentora.id) ?? 0;

      return {
        id: detentora.id,

        empresa:
          detentora.ata?.empresa?.nome_empresa ?? "-",

        curso:
          detentora.curso?.nome_curso ?? "-",

        contratado,

        utilizadas,

        saldo: contratado - utilizadas,
      };
    });

    const empresasMap = new Map<string, {
      empresa: string;
      cursos: typeof dados;
      totalContratado: number;
      totalUtilizado: number;
      saldoAtual: number;
    }>();

    for (const item of dados) {
      if (!empresasMap.has(item.empresa)) {
        empresasMap.set(item.empresa, {
          empresa: item.empresa,
          cursos: [],
          totalContratado: 0,
          totalUtilizado: 0,
          saldoAtual: 0,
        });
      }

      const empresa = empresasMap.get(item.empresa)!;

      empresa.cursos.push(item);

      empresa.totalContratado += item.contratado;
      empresa.totalUtilizado += item.utilizadas;
      empresa.saldoAtual += item.saldo;
    }

    const empresas = Array.from(empresasMap.values());

    const totalGeral = {
      contratado: empresas.reduce(
        (total, empresa) =>
          total + empresa.totalContratado,
        0
      ),

      utilizado: empresas.reduce(
        (total, empresa) =>
          total + empresa.totalUtilizado,
        0
      ),

      saldo: empresas.reduce(
        (total, empresa) =>
          total + empresa.saldoAtual,
        0
      ),
    };

    return {
      empresas,
      totalGeral,
    };
  }
}

export { GetRelatorioSaldoDetentoraService };