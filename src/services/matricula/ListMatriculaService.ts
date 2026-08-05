import prismaClient from "../../prisma";

class ListMatriculaService{

    async execute(){

        return await prismaClient.matricula.findMany({

            include:{
                aluno:true,
                cronograma:true
            }

        });

    }

}

export {ListMatriculaService}