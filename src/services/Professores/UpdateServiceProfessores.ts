
import prismaClient from "../../prisma";

interface ProfessorRequest {
  id: string;
  nome_professor: string;
  telefone: string;
  Endereco: string;
  bairro: string;
  Numero: string;
  contato: string;
  CPF: string;
  especialidade: string;
  foto?: string | null;
}

class UpdateServiceProfessores {
  async execute({
    id,
    nome_professor,
    telefone,
    Endereco,
    bairro,
    Numero,
    contato,
    CPF,
    especialidade,
    foto,
  }: ProfessorRequest) {
    const professorExistente = await prismaClient.professor.findUnique({
      where: { id },
    });

    if (!professorExistente) {
      throw new Error("Professor não encontrado.");
    }

    const professor = await prismaClient.professor.update({
      where: { id },
      data: {
        nome_professor,
        telefone,
        Endereco,
        bairro,
        Numero,
        contato,
        CPF,
        especialidade,
        ...(foto !== undefined ? { foto } : {}),
        updated_at: new Date(),
      },
    });

    return professor;
  }
}

export { UpdateServiceProfessores };
