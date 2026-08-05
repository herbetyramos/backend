import prismaClient from "../../prisma";

class ListServiceSala{
  async execute(){

    const Sala = await prismaClient.sala.findMany({
      select:{
        id: true,
        numero_sala:true,
        tipo_uso: true,
        local_id:true
       
      }
    })

    return Sala;

  }
}

export {ListServiceSala}