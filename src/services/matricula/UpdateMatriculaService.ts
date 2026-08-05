import prismaClient from "../../prisma";

class UpdateMatriculaService{

    async execute(data:any){

        const {id,...rest}=data;

        return prismaClient.matricula.update({
            where:{id},
            data:rest
        });

    }

}

export {UpdateMatriculaService}