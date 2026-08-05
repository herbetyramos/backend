import prismaClient from "../../prisma";

interface Planejamento {
  id: string;
  conteudo: string;
}

interface Request {
  planejamentos: Planejamento[];
}

class SalvarTudoPlanejamentoService {
  async execute({ planejamentos }: Request) {

    // Atualiza todos os registros em uma única transação
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