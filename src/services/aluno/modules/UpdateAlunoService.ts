import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


interface UpdateAlunoRequest {

  id: string;

  nome?: string;
  CPF?: string;
  celular?: string;
  email?: string;
  Telefone_recado?: string;

}


class UpdateAlunoService {


  async execute({

    id,
    nome,
    CPF,
    celular,
    email,
    Telefone_recado

  }: UpdateAlunoRequest) {


    const alunoExiste = await prisma.aluno.findUnique({

      where: {
        id
      }

    });



    if (!alunoExiste) {

      throw new Error(
        "Aluno não encontrado"
      );

    }



    // Caso altere o CPF,
    // verifica se já existe outro aluno com o mesmo CPF

    if (CPF && CPF !== alunoExiste.CPF) {


      const cpfExiste = await prisma.aluno.findUnique({

        where: {
          CPF
        }

      });



      if (cpfExiste) {

        throw new Error(
          "Já existe aluno cadastrado com este CPF"
        );

      }

    }



    const aluno = await prisma.aluno.update({

      where: {
        id
      },


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


export { UpdateAlunoService };