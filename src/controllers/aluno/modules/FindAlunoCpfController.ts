import { Request, Response } from "express";
import { FindAlunoCpfService } from "../../../services/aluno/modules/FindAlunoCpfService";


class FindAlunoCpfController {


  async handle(req: Request, res: Response) {


    const { cpf } = req.params;


    const findAlunoCpfService =
      new FindAlunoCpfService();



    const aluno =
      await findAlunoCpfService.execute(cpf);



    return res.json(aluno);


  }


}


export { FindAlunoCpfController };