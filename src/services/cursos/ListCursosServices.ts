import prismaClient  from "../../prisma";
 
  
class ListCursosServices {
  async execute() {
    return await prismaClient.cursos.findMany({
      select: {
        id: true,
        nome_curso:true,
      }
    });
  

  }
}

export {ListCursosServices}