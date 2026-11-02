-- AlterTable
ALTER TABLE "detentora" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "valor_curso" DECIMAL(10,2) NOT NULL DEFAULT 0;
