/*
  Warnings:

  - A unique constraint covering the columns `[whatsappId]` on the table `Mensagem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Mensagem" ADD COLUMN     "whatsappId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Mensagem_whatsappId_key" ON "Mensagem"("whatsappId");

-- CreateIndex
CREATE INDEX "Mensagem_conversaId_idx" ON "Mensagem"("conversaId");
