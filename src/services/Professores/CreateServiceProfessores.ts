import prismaClient from '../../prisma';

interface ProfessorRequest{
   nome_professor:string;
   telefone:string;
   Endereco:string;
   bairro:string;
   Numero:string;
   contato:string;
   CPF:string;
   especialidade:string;
   foto?: string | null;
}

class CreateServiceProfessores{
  async execute({nome_professor, telefone, Endereco, bairro, Numero, contato, CPF, especialidade, foto}:ProfessorRequest){

   
    const professor = await prismaClient.professor.create({
      data:{
      nome_professor: nome_professor,
      telefone:telefone,
      Endereco:     Endereco,
      bairro:      bairro,
      Numero:      Numero,
      contato:      contato,
      CPF :        CPF,
      especialidade: especialidade,
      foto: foto,
      },
      select:{
        id: true,
        nome_professor:true,
      }
    })
  return professor
  }
}

export {CreateServiceProfessores}

