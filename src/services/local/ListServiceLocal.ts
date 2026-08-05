import prismaClient from "../../prisma";

class ListServiceLocal{
  async execute(){

    const local = await prismaClient.local.findMany({
      select:{
        id:true,
        polo: true,
        Telefone:true,
        Telefone2:true
               
      }
    })

    return local;

  }
}

export {ListServiceLocal}