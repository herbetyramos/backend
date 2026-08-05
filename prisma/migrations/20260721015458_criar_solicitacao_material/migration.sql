-- CreateEnum
CREATE TYPE "StatusSolicitacaoMaterial" AS ENUM ('PENDENTE', 'APROVADO', 'ENTREGUE', 'CANCELADO');

-- CreateTable
CREATE TABLE "solicitacaoMateriais" (
    "id" TEXT NOT NULL,
    "id_curso" TEXT NOT NULL,
    "id_material" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "observacao" TEXT,
    "status" "StatusSolicitacaoMaterial" NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacaoMateriais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitacaoMateriais_id_curso_idx" ON "solicitacaoMateriais"("id_curso");

-- CreateIndex
CREATE INDEX "solicitacaoMateriais_id_material_idx" ON "solicitacaoMateriais"("id_material");

-- AddForeignKey
ALTER TABLE "solicitacaoMateriais" ADD CONSTRAINT "solicitacaoMateriais_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacaoMateriais" ADD CONSTRAINT "solicitacaoMateriais_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "materiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
