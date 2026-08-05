import prismaClient from "../../prisma";

class DeletePlanejamentoService{

    async execute(id:string){

        await prismaClient.planejamentoAula.delete({

            where:{
                id
            }

        });

        return{
            message:"Planejamento removido."
        }

    }

}

export {DeletePlanejamentoService}