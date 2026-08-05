import prismaClient from "../../prisma";

class DeleteAlunoService{

    async execute(id:string){

        return await prismaClient.aluno.delete({
            where:{id}
        });

    }

}

export {DeleteAlunoService}