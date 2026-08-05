import prismaClient from "../../prisma";

class ListServiceBloco{
  async execute(){

    const bloco = await prismaClient.blocoCurso.findMany({
      select:{
        
        bloco_Curso:true,
        id: true,
        
       
      }
    })

    return bloco;

  }
}

export {ListServiceBloco}