import prismaClient from '../../prisma';

interface LicitacaoRequest{
  objeto:           string,
  numero_licitacao:  string
  
}

class CreateServiceLicitacao{
  async execute({objeto, numero_licitacao}:LicitacaoRequest){
   
    const licitacao = await prismaClient.licitacao.create({
      data:{
      objeto: objeto,
      numero_licitacao: numero_licitacao   
      
      },
      select:{
        id: true,
        numero_licitacao:true,
        objeto: true
      }
    })
  return licitacao
  }
}

export {CreateServiceLicitacao}
