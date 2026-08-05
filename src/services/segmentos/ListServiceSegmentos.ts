import prismaClient from "../../prisma";

class ListServiceSegmentos{
  async execute(){

    const segmentos = await prismaClient.segmento.findMany({
      select:{
        id:true,
        name:true,
      }
    })

    return segmentos;

  }
}

export {ListServiceSegmentos}