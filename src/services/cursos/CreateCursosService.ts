import prismaClient from "../../prisma";


interface CursosRequest{

  nome_curso:string,
  price:string,
  description:string,
  segmento_id:string,
  banner: string,
  
}

class CreateCursosService{
  async execute({nome_curso, price, description, segmento_id,banner}:CursosRequest){

    const cursos = await prismaClient.cursos.create({
      data:{
        nome_curso:nome_curso,
        price:price,
        description:description,
        segmento_id:segmento_id,
        banner: banner,
      }
    })
    return cursos;
  }
}

export {CreateCursosService};