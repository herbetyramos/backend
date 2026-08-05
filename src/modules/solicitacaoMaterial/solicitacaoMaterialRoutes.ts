import { Router } from "express";

import { CreateSolicitacaoMaterialController } from "../../controllers/solicitacaoMaterial/CreateSolicitacaoMaterialController";
import { ListSolicitacaoCronogramaController } from "../../controllers/solicitacaoMaterial/ListSolicitacaoMaterialController";
import { UpdateSolicitacaoMaterialController } from "../../controllers/solicitacaoMaterial/UpdateSolicitacaoMaterialController";
import { DeleteSolicitacaoMaterialController } from "../../controllers/solicitacaoMaterial/DeleteSolicitacaoMaterialController";
import { ListMateriaisCronogramaController } from "../../controllers/solicitacaoMaterial/ListMateriaisCronogramaController";

const solicitacaoMaterialRoutes = Router();

// Criar solicitação
solicitacaoMaterialRoutes.post(
    "/solicitacao-material",
    new CreateSolicitacaoMaterialController().handle
);

// Listar materiais do curso do cronograma
solicitacaoMaterialRoutes.get(
    "/solicitacao-material/materiais",
    new ListMateriaisCronogramaController().handle
);

// Listar solicitações do cronograma
solicitacaoMaterialRoutes.get(
    "/solicitacao-material",
    new ListSolicitacaoCronogramaController().handle
);

// Atualizar solicitação
solicitacaoMaterialRoutes.put(
    "/solicitacao-material/:id",
    new UpdateSolicitacaoMaterialController().handle
);

// Excluir solicitação
solicitacaoMaterialRoutes.delete(
    "/solicitacao-material/:id",
    new DeleteSolicitacaoMaterialController().handle
);

export { solicitacaoMaterialRoutes };