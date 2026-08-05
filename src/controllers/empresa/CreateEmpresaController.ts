import { Request, Response } from "express";
import {CreateServiceEmpresa} from  '../../services/empresa/CreateServiceEmpresa'


class CreateEmpresaController{
  async handle(req:Request, res:Response){
const {nome_empresa,telefone, representante, CNPJ} = req.body

const createEmpresaControle = new CreateServiceEmpresa();  
    
const empresa = await createEmpresaControle.execute({
      nome_empresa,telefone, representante, CNPJ});

      return res.json(empresa);
      
  }
}

export {CreateEmpresaController}