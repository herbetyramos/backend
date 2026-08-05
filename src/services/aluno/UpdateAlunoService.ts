import prismaClient from "../../prisma";

class UpdateAlunoService{

    async execute(data:any){

        const {id,...rest}=data;

        return await prismaClient.aluno.update({
            where:{id},
            data:rest
        });

    }

}

export {UpdateAlunoService}