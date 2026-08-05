/*
  Warnings:

  - You are about to drop the column `tipo` on the `Mensagem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mensagem" DROP COLUMN "tipo",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
