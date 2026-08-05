import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ListMaterialService {

  async execute() {

    const materiais = await prisma.materiais.findMany({

      include: {

        curso: {
          select: {
            id: true,
            nome_curso: true
          }
        }

      },

      orderBy: [
        {
          curso: {
            nome_curso: "asc"
          }
        },
        {
          nome_material: "asc"
        }
      ]

    });

    return materiais;

  }

}

export { ListMaterialService };