
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

    // CONVERSÃO PARA CENTAVOS PARA EVITAR ERROS DE ARREDONDAMENTO
    const paraCentavos = (valor: number) =>
      Math.round(valor * 100);

    const dados = detentoras.map((detentora) => {
      const contratado =
        detentora.quantidade_turma ?? 0;

      const utilizadas =
        mapaUtilizadas.get(detentora.id) ?? 0;

      const saldo = contratado - utilizadas;

      const valorUnitario =
        Number(detentora.valor_curso ?? 0);

      const valorUnitarioCentavos =
        paraCentavos(valorUnitario);

      const valorContratadoCentavos =
        contratado * valorUnitarioCentavos;

      const valorUtilizadoCentavos =
        utilizadas * valorUnitarioCentavos;

      const valorSaldoCentavos =
        saldo * valorUnitarioCentavos;

      return {
        id: detentora.id,

        empresa:
          detentora.ata?.empresa?.nome_empresa ?? "-",

        curso:
          detentora.curso?.nome_curso ?? "-",

        contratado,

        utilizadas,

        saldo,

        // VALORES FINANCEIROS
        valorUnitario,

        valorContratado:
          valorContratadoCentavos / 100,

        valorUtilizado:
          valorUtilizadoCentavos / 100,

        valorSaldo:
          valorSaldoCentavos / 100,
      };
    });

    // AGRUPAMENTO POR EMPRESA
    const empresasMap = new Map<
      string,
      {
        empresa: string;
        cursos: typeof dados;
        totalContratado: number;
        totalUtilizado: number;
        saldoAtual: number;
        totalValorContratadoCentavos: number;
        totalValorUtilizadoCentavos: number;
        totalValorSaldoCentavos: number;
      }
    >();

    for (const item of dados) {
      if (!empresasMap.has(item.empresa)) {
        empresasMap.set(item.empresa, {
          empresa: item.empresa,
          cursos: [],
          totalContratado: 0,
          totalUtilizado: 0,
          saldoAtual: 0,
          totalValorContratadoCentavos: 0,
          totalValorUtilizadoCentavos: 0,
          totalValorSaldoCentavos: 0,
        });
      }

      const empresa = empresasMap.get(item.empresa)!;

      empresa.cursos.push(item);

      empresa.totalContratado += item.contratado;
      empresa.totalUtilizado += item.utilizadas;
      empresa.saldoAtual += item.saldo;

      empresa.totalValorContratadoCentavos +=
        paraCentavos(item.valorContratado);

      empresa.totalValorUtilizadoCentavos +=
        paraCentavos(item.valorUtilizado);

      empresa.totalValorSaldoCentavos +=
        paraCentavos(item.valorSaldo);
    }

    const empresas = Array.from(empresasMap.values()).map(
      (empresa) => ({
        empresa: empresa.empresa,
        cursos: empresa.cursos,

        totalContratado: empresa.totalContratado,
        totalUtilizado: empresa.totalUtilizado,
        saldoAtual: empresa.saldoAtual,

        totalValorContratado:
          empresa.totalValorContratadoCentavos / 100,

        totalValorUtilizado:
          empresa.totalValorUtilizadoCentavos / 100,

        totalValorSaldo:
          empresa.totalValorSaldoCentavos / 100,
      })
    );

    // TOTAL GERAL
    const totalGeral = {
      contratado: 0,
      utilizado: 0,
      saldo: 0,

      valorContratado: 0,
      valorUtilizado: 0,
      valorSaldo: 0,
    };

    for (const empresa of empresas) {
      totalGeral.contratado += empresa.totalContratado;
      totalGeral.utilizado += empresa.totalUtilizado;
      totalGeral.saldo += empresa.saldoAtual;

      totalGeral.valorContratado +=
        paraCentavos(empresa.totalValorContratado);

      totalGeral.valorUtilizado +=
        paraCentavos(empresa.totalValorUtilizado);

      totalGeral.valorSaldo +=
        paraCentavos(empresa.totalValorSaldo);
    }

    return {
      empresas,

      totalGeral: {
        contratado: totalGeral.contratado,
        utilizado: totalGeral.utilizado,
        saldo: totalGeral.saldo,

        valorContratado:
          totalGeral.valorContratado / 100,

        valorUtilizado:
          totalGeral.valorUtilizado / 100,

        valorSaldo:
          totalGeral.valorSaldo / 100,
      },
    };
  }
}

export { GetRelatorioSaldoDetentoraService };
