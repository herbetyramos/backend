import prismaClient from '../../prisma';

interface SalaRequest{
  numero_sala: string,
  local_id:    string,
  tipo_uso: string
    
}

class CreateServiceSala{
  async execute({numero_sala, local_id, tipo_uso}:SalaRequest){
   
    const sala = await prismaClient.sala.create({
      data:{
      numero_sala: numero_sala,
      local_id: local_id,
      tipo_uso: tipo_uso      
      },
      select:{
        id: true,
        numero_sala:true,
        local_id: true,
        tipo_uso:true
      }
    })
  return sala
  }
}

export {CreateServiceSala}
