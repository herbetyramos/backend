/*
  Warnings:

  - You are about to drop the column `id_curso` on the `solicitacaoMateriais` table. All the data in the column will be lost.
  - Added the required column `id_cronograma` to the `solicitacaoMateriais` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "solicitacaoMateriais" DROP CONSTRAINT "solicitacaoMateriais_id_curso_fkey";

-- DropIndex
DROP INDEX "solicitacaoMateriais_id_curso_idx";

-- AlterTable
ALTER TABLE "solicitacaoMateriais" DROP COLUMN "id_curso",
ADD COLUMN     "id_cronograma" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "solicitacaoMateriais_id_cronograma_idx" ON "solicitacaoMateriais"("id_cronograma");

-- AddForeignKey
ALTER TABLE "solicitacaoMateriais" ADD CONSTRAINT "solicitacaoMateriais_id_cronograma_fkey" FOREIGN KEY ("id_cronograma") REFERENCES "cronogramaCursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
