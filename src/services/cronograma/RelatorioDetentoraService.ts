import prismaClient from "../../prisma";

class RelatorioDetentoraService {
  async execute() {

    const cronogramas = await prismaClient.cronogramaCurso.findMany({
      include: {
        professor: true,
        localAula: true,
        salaAula: true,
        bloco_curso: true,
        formatura: true,

        detentoras: {
          include: {
            curso: true,
            ata: {
              include: {
                empresa: true
                
              }
            }
          }
        }
      },

      orderBy: [
        {
          codigo: "asc"
        }
      ]
    });

    const agrupado: Record<string, any> = {};

    cronogramas.forEach((item) => {

      const empresa =
        item.detentoras?.ata?.empresa?.nome_empresa ??
        "SEM DETENTORA";

      const polo =
        item.localAula?.polo ??
        "SEM LOCAL";

      const sala = item.salaAula
        ? `${item.salaAula.numero_sala} (${item.salaAula.tipo_uso})`
        : "SEM SALA";

      if (!agrupado[empresa]) {
        agrupado[empresa] = {};
      }

      if (!agrupado[empresa][polo]) {
        agrupado[empresa][polo] = {};
      }

      if (!agrupado[empresa][polo][sala]) {
        agrupado[empresa][polo][sala] = [];
      }

      agrupado[empresa][polo][sala].push(item);

    });

    return agrupado;
  }
}

export { RelatorioDetentoraService };