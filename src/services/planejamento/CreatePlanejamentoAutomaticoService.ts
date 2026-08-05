import prismaClient from "../../prisma";


interface Request {

  planeja_id:string;

}



class CreatePlanejamentoAutomaticoService {


  async execute({

    planeja_id

  }:Request){



    const cronograma =

      await prismaClient.cronogramaCurso.findUnique({

        where:{
          id:planeja_id
        }

      });





    if(!cronograma){

      throw new Error(
        "Cronograma não encontrado."
      );

    }







    const existe =

      await prismaClient.planejamentoAula.count({

        where:{
          planeja_id
        }

      });





    if(existe > 0){

      throw new Error(
        "Planejamento já foi criado."
      );

    }







    let dataInicial = new Date(
      cronograma.data_inicio
    );



    // Caso venha no formato brasileiro DD/MM/YYYY

    if(isNaN(dataInicial.getTime())){


      const partes =

        cronograma.data_inicio.split("/");



      if(partes.length === 3){


        dataInicial = new Date(

          Number(partes[2]),

          Number(partes[1])-1,

          Number(partes[0])

        );


      }

    }






    if(isNaN(dataInicial.getTime())){


      throw new Error(
        "Data inicial do cronograma inválida."
      );

    }








    const dados = [];





    for(let dia = 1; dia <= 10; dia++){



      const dataAula = new Date(
        dataInicial
      );



      dataAula.setDate(

        dataInicial.getDate()
        +
        (dia - 1)

      );





      dados.push({

        planeja_id,

        dia,

        data_aula:dataAula,

        conteudo:"",

        finalizado:false

      });



    }







    await prismaClient.planejamentoAula.createMany({

      data:dados

    });







    return await prismaClient.planejamentoAula.findMany({

      where:{
        planeja_id
      },


      orderBy:{
        dia:"asc"
      },


      include:{

        curso_programado:true

      }

    });



  }


}



export {
  CreatePlanejamentoAutomaticoService
};