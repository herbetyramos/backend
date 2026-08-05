import prismaClient from '../../prisma';

interface FormaturaRequest{
  data_formatura:  string,
  local:      string,
    
}

class CreateServiceFormatura{
  async execute({data_formatura, local}:FormaturaRequest){
   
    const formatura = await prismaClient.formatura.create({
      data:{
      data_formatura: data_formatura,
      local: local  
      
      },
      select:{
        id: true,
        data_formatura:true,
        local: true
      }
    })
  return formatura
  }
}

export {CreateServiceFormatura}
