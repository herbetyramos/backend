import prismaClient from '../../prisma';

interface EmpresaRequest{
  nome_empresa:  string,
  representante: string,
  telefone:      string,
  CNPJ:          string

}

class CreateServiceEmpresa{
  async execute({nome_empresa, representante, telefone, CNPJ}:EmpresaRequest){

   
    const empresa = await prismaClient.empresa.create({
      data:{
      nome_empresa: nome_empresa,      
      representante: representante,
      telefone:telefone,      
      CNPJ: CNPJ,
      },
      select:{
        id: true,
        nome_empresa:true,
      }
    })
  return empresa
  }
}

export {CreateServiceEmpresa}
