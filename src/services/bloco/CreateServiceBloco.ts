import prismaClient from '../../prisma';

interface AtaRequest{
  bloco_Curso:        string,

    
}

class CreateServiceBloco{
  async execute({bloco_Curso}:AtaRequest){
   
    const bloco = await prismaClient.blocoCurso.create({
      data:{
      bloco_Curso: bloco_Curso,     
      
      },
      select:{
        id: true,
        bloco_Curso:true,
        
      }
    })
  return bloco
  }
}

export {CreateServiceBloco}
