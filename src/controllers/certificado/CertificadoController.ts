import { Request, Response } from "express";
import { CertificadoService } from "../../services/certificado/CertificadoService";


class CertificadoController {

    async handle(req: Request, res: Response){

        const { id } = req.params;


        const service = new CertificadoService();


        const alunos = await service.execute(id);


        return res.json(alunos);

    }

}


export { CertificadoController };