import prismaClient from "../../prisma";

class ListServiceLicitacao{
  async execute(){

    const licitacao = await prismaClient.licitacao.findMany({
      select:{
        
        numero_licitacao:true,
        objeto: true,
        id:true,
        
       
      }
    })

    return licitacao;

  }
}

export {ListServiceLicitacao}