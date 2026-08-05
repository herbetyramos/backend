import prismaClient from "../../prisma";

class ListServiceProfessores{
  async execute(){

    const professor = await prismaClient.professor.findMany({
      select:{
        id:true,
        nome_professor:true,
      }
    })

    return professor;

  }
}

export {ListServiceProfessores}