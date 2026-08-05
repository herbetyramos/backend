import prismaClient from '../../prisma';

interface SegmentoRequest{
  name: string;

}

class CreateServiceSegmentos{
  async execute({name}:SegmentoRequest){

    if(name === ''){
      throw new Error('Nome invalido')
    }

    const segmento = await prismaClient.segmento.create({
      data:{
        name: name,
      },
      select:{
        id: true,
        name:true,
      }
    })
  return segmento
  }
}

export {CreateServiceSegmentos}
