import prismaClient from '../../prisma';

interface AtaRequest{
  
  ata_id: string,
  cursos_id: string,
  quantidade_turma:number,
  
    
}

class CreateServiceDetentora{
  async execute({ ata_id, cursos_id, quantidade_turma}:AtaRequest){
   
    const detentora = await prismaClient.detentora.create({
      data:{
      
      ata_id: ata_id,
      cursos_id: cursos_id,
      quantidade_turma:quantidade_turma,
      
      },
      select:{
        id: true,
        ata_id: true,
        cursos_id:true,
        quantidade_turma:true
      }
    })
  return detentora
  }
}

export {CreateServiceDetentora}
