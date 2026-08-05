import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class DeleteMaterialService{


async execute(id:string){


await prisma.materiais.delete({

where:{
 id
}

});


return {
success:true,
message:"Material removido."
};


}


}


export {DeleteMaterialService};