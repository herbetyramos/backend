/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `cronogramaCursos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cronogramaCursos" ADD COLUMN     "codigo" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cronogramaCursos_codigo_key" ON "cronogramaCursos"("codigo");
