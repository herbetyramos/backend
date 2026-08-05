import prismaClient from "../../prisma";

class ListAtaServices {
  async execute() {
    const ata = await prismaClient.ata.findMany({
    select:{
        
        
        id:true,
        numero_ata: true,
        licitacao_id: true,
        id_empresa:true
        
       
      }
    })

    return ata;
  }
}

export { ListAtaServices };