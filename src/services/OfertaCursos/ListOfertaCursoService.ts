import prismaClient from "../../prisma";

class ListOfertaCursoService {
  async execute() {
    const ofertas = await prismaClient.cronogramaCurso.findMany({
      where: {
        publicar: true,
      },
      include: {
              
        localAula: true,        
      
        detentoras: {
          include: {
            curso: {
              select: {
                id: true,
                nome_curso: true,
                banner: true, // pego aqui
              }
            }
          }
        }
      },
      orderBy: {
        data_inicio: "asc",
      
      },
       
    });

    return ofertas;
  }
}

export { ListOfertaCursoService };