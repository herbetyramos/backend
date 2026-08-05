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
    const telefoneLimpo = telefone.replace(/\D/g, "");

    // Procura primeiro pelo aluno
    if (aluno_id) {
      const conversaAluno = await prismaClient.conversa.findFirst({
        where: {
          aluno_id,
        },
      });

      if (conversaAluno) {
        return conversaAluno;
      }
    }

    // Caso não exista aluno vinculado, procura pelo telefone
    const conversaTelefone = await prismaClient.conversa.findFirst({
      where: {
        telefone: telefoneLimpo,
      },
    });

    if (conversaTelefone) {
      return conversaTelefone;
    }

    // Cria a conversa
    const conversa = await prismaClient.conversa.create({
      data: {
        telefone: telefoneLimpo,
        nome,
        aluno_id,
        professor_id,
        ultimaMensagem: "",
        ultimaData: new Date(),
      },
    });

    return conversa;
  }
}

export { CreateConversaService };