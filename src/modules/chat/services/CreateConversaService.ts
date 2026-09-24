import prismaClient from "../../../prisma";

interface CreateConversaRequest {
  telefone: string;
  nome?: string;
  aluno_id?: string;
  professor_id?: string;
}

class CreateConversaService {
  async execute({
    telefone,
    nome,
    aluno_id,
    professor_id,
  }: CreateConversaRequest) {
    const telefoneLimpo =
      telefone.replace(/\D/g, "");

    // =====================================================
    // PROCURA PRIMEIRO PELA CONVERSA VINCULADA AO ALUNO
    // =====================================================

    if (aluno_id) {
      const conversaAluno =
        await prismaClient.conversa.findFirst({
          where: {
            aluno_id,
          },
        });

      if (conversaAluno) {
        // Atualiza o telefone caso o cadastro do aluno tenha mudado
        if (
          conversaAluno.telefone !==
          telefoneLimpo
        ) {
          const conversaAtualizada =
            await prismaClient.conversa.update({
              where: {
                id: conversaAluno.id,
              },
              data: {
                telefone: telefoneLimpo,
                nome:
                  nome ??
                  conversaAluno.nome,
              },
            });

          return conversaAtualizada;
        }

        return conversaAluno;
      }
    }

    // =====================================================
    // CASO NÃO EXISTA ALUNO VINCULADO,
    // PROCURA PELO TELEFONE
    // =====================================================

    const conversaTelefone =
      await prismaClient.conversa.findFirst({
        where: {
          telefone: telefoneLimpo,
        },
      });

    if (conversaTelefone) {
      return conversaTelefone;
    }

    // =====================================================
    // CRIA UMA NOVA CONVERSA
    // =====================================================

    const conversa =
      await prismaClient.conversa.create({
        data: {
          telefone: telefoneLimpo,
          nome,
          aluno_id,
          professor_id,
          ultimaMensagem: "",
          ultimaData: new Date(),

          // Toda conversa nova começa aguardando atendimento
          status:
            "AGUARDANDO_ATENDIMENTO",
        },
      });

    return conversa;
  }
}

export { CreateConversaService };

