import prismaClient from "../../prisma";

class ListServiceFormatura{
  async execute(){

    const formatura = await prismaClient.formatura.findMany({
      select:{
        
        id: true,      
        data_formatura: true,
        local: true
              
       
      }
    })

    return formatura;

  }
}

export {ListServiceFormatura}