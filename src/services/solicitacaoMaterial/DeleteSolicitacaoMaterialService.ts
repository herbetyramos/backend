import prismaClient from "../../prisma";


class DeleteSolicitacaoMaterialService{


    async execute(id:string){


        const solicitacao = await prismaClient.solicitacaoMaterial.findUnique({

            where:{
                id
            }

        });



        if(!solicitacao){

            throw new Error("Solicitação não encontrada");

        }



        await prismaClient.solicitacaoMaterial.delete({

            where:{
                id
            }

        });



        return {
            mensagem:"Solicitação excluída com sucesso"
        };


    }


}


export {DeleteSolicitacaoMaterialService};