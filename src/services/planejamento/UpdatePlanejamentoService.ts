import prismaClient from "../../prisma";

interface UpdateRequest{
    id:string;
    conteudo:string;
}

class UpdatePlanejamentoService{

    async execute({
        id,
        conteudo
    }:UpdateRequest){

        const planejamento=await prismaClient.planejamentoAula.update({

            where:{
                id
            },

            data:{
                conteudo
            }

        });

        return planejamento;

    }

}

export {UpdatePlanejamentoService}