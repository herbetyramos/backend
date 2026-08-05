import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class ListMaterialService {


async execute(id_curso:string){


const materiais = await prisma.materiais.findMany({

where:{
 id_curso
},

include:{
 curso:true
},

orderBy:{
 nome_material:"asc"
}


});


return materiais;


}


}


export {ListMaterialService};