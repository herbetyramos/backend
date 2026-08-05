import { PrismaClient, PropriedadeMaterial } from "@prisma/client";


const prisma = new PrismaClient();


interface UpdateMaterialRequest {

id:string;
propriedade:PropriedadeMaterial;
nome_material:string;
qtde?:number;

}



class UpdateMaterialService {


async execute({

id,
propriedade,
nome_material,
qtde

}:UpdateMaterialRequest){


const material = await prisma.materiais.update({

where:{
 id
},

data:{
 propriedade,
 nome_material,
 qtde
}

});


return material;


}


}


export { UpdateMaterialService };