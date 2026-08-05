import prismaClient from '../../prisma';

interface LocalRequest{
 polo: string,
 Telefone: string,
 Telefone2: string
}

class CreateServiceLocal{
  async execute({polo, Telefone, Telefone2}:LocalRequest){
   
    const local = await prismaClient.local.create({
      data:{
      polo: polo, 
      Telefone: Telefone,
      Telefone2: Telefone2,      
      
      },
      select:{
        id: true,
        polo:true,
      }
    })
  return local
  }
}

export {CreateServiceLocal}
