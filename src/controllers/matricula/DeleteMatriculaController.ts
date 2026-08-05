import { Request, Response } from "express";

import { DeleteMatriculaService } from "../../services/matricula/DeleteMatriculaService";



class DeleteMatriculaController {


  async handle(
    req: Request,
    res: Response
  ) {


    const { id } = req.params;



    const service =
      new DeleteMatriculaService();



    try {


      await service.execute(id);



      return res.json({

        message:
          "Matrícula excluída com sucesso."

      });



    } catch (error: any) {


      return res.status(400).json({

        error: error.message

      });


    }


  }


}



export {
  DeleteMatriculaController
};