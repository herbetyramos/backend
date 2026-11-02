
import prismaClient from "../../prisma";

interface UpdateDetentoraRequest {
  id: string;
  ata_id?: string | null;
  cursos_id?: string;
  quantidade_turma?: number | null;
  valor_curso?: string | number;
  ativo?: boolean;
}

class UpdateServiceDetentora {
  async execute({
    id,
    ata_id,
    cursos_id,
    quantidade_turma,
    valor_curso,
    ativo,
  }: UpdateDetentoraRequest) {
    const detentora = await prismaClient.detentora.update({
      where: { id },
      data: {
        ...(ata_id !== undefined && { ata_id }),
        ...(cursos_id !== undefined && { cursos_id }),
        ...(quantidade_turma !== undefined && {
          quantidade_turma,
        }),
        ...(valor_curso !== undefined && {
          valor_curso: String(valor_curso),
        }),
        ...(ativo !== undefined && { ativo }),
      },
      select: {
        id: true,
        ata_id: true,
        cursos_id: true,
        quantidade_turma: true,
        valor_curso: true,
        ativo: true,
        curso: true,
        ata: true,
      },
    });

    return detentora;
  }
}

export { UpdateServiceDetentora };
