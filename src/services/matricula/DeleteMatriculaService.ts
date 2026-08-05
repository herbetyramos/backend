import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



class DeleteMatriculaService {


  async execute(
    id: string
  ) {


    const matricula =
      await prisma.matricula.findUnique({

        where: {

          id

        }

      });



    if (!matricula) {


      throw new Error(
        "Matrícula não encontrada."
      );


    }



    await prisma.matricula.delete({

      where: {

        id

      }

    });



    return true;


  }


}



export {
  DeleteMatriculaService
};