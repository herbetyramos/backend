import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class ListMatriculaCronogramaService {


  async execute(
    id_cronograma: string
  ) {

     console.log("ID no service:", id_cronograma);


    const cronograma =
      await prisma.cronogramaCurso.findUnique({

        where: {

          id: id_cronograma

        },


        include: {


          professor: true,


          localAula: true,


          salaAula: true,


          formatura: true,


          detentoras: {

            include: {

              curso: true

            }

          }


        }


      });




    if (!cronograma) {


      throw new Error(
        "Cronograma não encontrado."
      );


    }




    /*
      Buscar materiais através do curso

      Cronograma
          ↓
      Detentora
          ↓
      Curso
          ↓
      Materiais
    */


    const materiais =
  cronograma.detentoras?.cursos_id
    ? await prisma.materiais.findMany({

        where: {

          id_curso:
            cronograma.detentoras.cursos_id

        },

        orderBy: {

          nome_material: "asc"

        }

      })
    : [];







    const matriculas =
      await prisma.matricula.findMany({

        where: {

          id_cronograma

        },


        include: {

          aluno: true

        },


        orderBy: {

          created_at: "desc"

        }


      });





    return {


      cronograma,


      materiais,


      matriculas


    };



  }


}



export {
  ListMatriculaCronogramaService
};