import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


interface CreateAlunoRequest {

  nome: string;
  CPF: string;
  celular: string;
  email?: string;
  Telefone_recado?: string;

}


class CreateAlunoService {


  async execute({
    nome,
    CPF,
    celular,
    email,
    Telefone_recado

  }: CreateAlunoRequest) {


    // Verifica se CPF já existe

    const alunoExiste = await prisma.aluno.findUnique({

      where: {
        CPF
      }

    });



    if (alunoExiste) {

      throw new Error(
        "Aluno já cadastrado com este CPF"
      );

    }



    // Cria aluno

    const aluno = await prisma.aluno.create({

      data: {

        nome,

        CPF,

        celular,

        email,

        Telefone_recado

      }

    });



    return aluno;


  }


}


export { CreateAlunoService };