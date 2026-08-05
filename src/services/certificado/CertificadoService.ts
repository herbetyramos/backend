import  prismaClient  from "../../prisma";


class CertificadoService {


async execute(id_cronograma:string){


const alunos = await prismaClient.matricula.findMany({

where:{
    id_cronograma,
    aprovado:true
},


include:{


aluno:true,


cronograma:{

include:{


professor:true,

bloco_curso:true,

detentoras:{
    include:{
        curso:true,
        ata:{
            include:{
                empresa:true
            }
        }
    }
}


}

}


}


});


return alunos;


}


}


export { CertificadoService };