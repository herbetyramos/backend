import { PrismaClient, PropriedadeMaterial } from "@prisma/client";


const prisma = new PrismaClient();


interface UpdateMaterialRequest{

id:string;
nome_material:string;
propriedade:PropriedadeMaterial;
qtde?:number;

}



class UpdateMaterialService{


async execute({

id,
nome_material,
propriedade,
qtde

}:UpdateMaterialRequest){


const material = await prisma.materiais.update({

where:{
 id
},

data:{

nome_material,
propriedade,
qtde

}

});


return material;


}


}


export {UpdateMaterialService};