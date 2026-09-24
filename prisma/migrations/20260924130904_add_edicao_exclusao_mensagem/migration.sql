-- AlterTable
ALTER TABLE "Mensagem" ADD COLUMN     "apagada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editada" BOOLEAN NOT NULL DEFAULT false;
