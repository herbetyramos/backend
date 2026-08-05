/*
  Warnings:

  - The `qtde` column on the `materiais` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[CPF]` on the table `aluno` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `materiais` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `propriedade` on the `materiais` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `matricula` table without a default value. This is not possible if the table is not empty.
  - Made the column `confirmacao_curso` on table `matricula` required. This step will fail if there are existing NULL values in that column.
  - Made the column `confirmacao_formatura` on table `matricula` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aprovado` on table `matricula` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PropriedadeMaterial" AS ENUM ('PERMANENTE', 'NAO_PERMANENTE');

-- AlterTable
ALTER TABLE "materiais" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "propriedade",
ADD COLUMN     "propriedade" "PropriedadeMaterial" NOT NULL,
DROP COLUMN "qtde",
ADD COLUMN     "qtde" INTEGER;

-- AlterTable
ALTER TABLE "matricula" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "confirmacao_curso" SET NOT NULL,
ALTER COLUMN "confirmacao_curso" SET DEFAULT false,
ALTER COLUMN "confirmacao_formatura" SET NOT NULL,
ALTER COLUMN "confirmacao_formatura" SET DEFAULT false,
ALTER COLUMN "aprovado" SET NOT NULL,
ALTER COLUMN "aprovado" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "aluno_CPF_key" ON "aluno"("CPF");

-- CreateIndex
CREATE INDEX "materiais_id_curso_idx" ON "materiais"("id_curso");

-- CreateIndex
CREATE INDEX "matricula_id_cronograma_idx" ON "matricula"("id_cronograma");

-- CreateIndex
CREATE INDEX "matricula_id_aluno_idx" ON "matricula"("id_aluno");
