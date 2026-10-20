
import prismaClient from "../../prisma";

class FindServiceProfessores {
  async execute(id: string) {
    const professor = await prismaClient.professor.findUnique({
      where: { id },
      select: {
        id: true,
        nome_professor: true,
        telefone: true,
        Endereco: true,
        bairro: true,
        Numero: true,
        contato: true,
        CPF: true,
        especialidade: true,
        foto: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    return professor;
  }
}

export { FindServiceProfessores };
