import { Router } from "express";
import { CertificadoController } from "../../controllers/certificado/CertificadoController";


const certificadoRoutes = Router();

certificadoRoutes.get(
  "/cronograma/:id",
  new CertificadoController().handle
);

export { certificadoRoutes };