import { Request, Response } from "express";
import { ListMatriculaCronogramaService } from "../../services/matricula/ListMatriculaCronogramaService";

class ListMatriculaCronogramaController {

  async handle(
    req: Request,
    res: Response
  ) {

    console.log("================================");
    console.log("URL:", req.originalUrl);
    console.log("Params:", req.params);

    const id =
      req.params.id ??
      req.params.id_cronograma;

    console.log("ID recebido:", id);


    const service =
      new ListMatriculaCronogramaService();


    try {

      const dados =
        await service.execute(id);


      return res.json(dados);


    } catch (error: any) {


      console.error(error);


      return res.status(400).json({

        error: error.message

      });


    }

  }

}


export {
  ListMatriculaCronogramaController
};