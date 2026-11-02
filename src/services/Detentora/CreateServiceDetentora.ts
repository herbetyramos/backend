
import prismaClient from "../../prisma";

interface AtaRequest {
  ata_id?: string | null;
  cursos_id: string;
  quantidade_turma?: number | null;
  valor_curso?: number;
  ativo?: boolean;
}

class CreateServiceDetentora {
  async execute({
    ata_id,
    cursos_id,
    quantidade_turma,
    valor_curso = 0,
    ativo = true,
  }: AtaRequest) {
    const detentora = await prismaClient.detentora.create({
      data: {
        ata_id: ata_id || null,
        cursos_id,
        quantidade_turma,
        valor_curso,
        ativo,
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

export { CreateServiceDetentora };
