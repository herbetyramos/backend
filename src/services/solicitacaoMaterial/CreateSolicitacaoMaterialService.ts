import prismaClient from "../../prisma";

interface Item {
    id_material: string;
    quantidade: number;
}

interface Request {
    id_cronograma: string;
    observacao?: string;
    itens: Item[];
}

class CreateSolicitacaoMaterialService {

    async execute({ id_cronograma, observacao, itens }: Request) {

        // Remove solicitação anterior da turma
        await prismaClient.solicitacaoMaterial.deleteMany({
            where: {
                id_cronograma
            }
        });

        for (const item of itens) {

            await prismaClient.solicitacaoMaterial.create({

                data: {

                    id_cronograma,

                    id_material: item.id_material,

                    quantidade: item.quantidade,

                    observacao

                }

            });

        }

        return {
            message: "Solicitação salva com sucesso."
        }

    }

}

export { CreateSolicitacaoMaterialService };