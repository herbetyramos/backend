
import prismaClient from "../../prisma";

class DeleteServiceProfessores {
  async execute(id: string) {
    const professor = await prismaClient.professor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            CronogramaCursos: true,
          },
        },
      },
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    if (professor._count.CronogramaCursos > 0) {
      throw new Error(
        "Não é possível excluir este professor porque ele está vinculado a um ou mais cronogramas."
      );
    }

    return prismaClient.professor.delete({
      where: { id },
    });
  }
}

export { DeleteServiceProfessores };
