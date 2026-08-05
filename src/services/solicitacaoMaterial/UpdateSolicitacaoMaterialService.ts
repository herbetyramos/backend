import prismaClient from "../../prisma";


interface UpdateRequest {

    id: string;

    status:
    | "PENDENTE"
    | "APROVADO"
    | "ENTREGUE"
    | "CANCELADO";

}



class UpdateSolicitacaoMaterialService {


    async execute({

        id,
        status

    }: UpdateRequest) {



        const solicitacao =
            await prismaClient.solicitacaoMaterial.findUnique({

                where:{
                    id
                }

            });



        if(!solicitacao){

            throw new Error(
                "Solicitação não encontrada"
            );

        }





        const atualizada =
            await prismaClient.solicitacaoMaterial.update({

                where:{
                    id
                },


                data:{

                    status

                },


                include:{


                    material:true,


                    cronograma:{

                        include:{


                            detentoras:{

                                include:{

                                    curso:true

                                }

                            },


                            professor:true,


                            localAula:true,


                            salaAula:true

                        }

                    }


                }


            });




        return atualizada;


    }


}


export {
    UpdateSolicitacaoMaterialService
};