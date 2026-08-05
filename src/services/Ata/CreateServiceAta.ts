import prismaClient from '../../prisma';

interface AtaRequest {
  numero_ata: string;
  licitacao_id: string;
  id_empresa: string; 
}

class CreateServiceAta {
  async execute({ numero_ata, licitacao_id, id_empresa }: AtaRequest) {

    const ata = await prismaClient.ata.create({
      data: {
        numero_ata,
        licitacao_id,
        id_empresa, 

      },
      select: {
        id: true,
        numero_ata: true,
        licitacao_id: true,
        id_empresa: true,
      }
    });

    return ata;
  }
}

export { CreateServiceAta };
