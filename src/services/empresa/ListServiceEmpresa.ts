import prismaClient from "../../prisma";

class ListServiceEmpresa{
  async execute(){

    const empresa = await prismaClient.empresa.findMany({
      select:{
        
        nome_empresa:true,
        id: true
              
       
      }
    })

    return empresa;

  }
}

export {ListServiceEmpresa}