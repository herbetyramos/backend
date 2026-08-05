import { Request,Response } from "express";
import {CreateServiceSegmentos} from "../../services/segmentos/CreateServiceSegmentos"


class CreateSegmentoController{

  async handle(req: Request, res:Response){
    const {name} = req.body;
    const createServiceSegmentos = new CreateServiceSegmentos();
    const segmento = await createServiceSegmentos.execute({
      name
    });

    return res.json(segmento);

  }

}

export{CreateSegmentoController}