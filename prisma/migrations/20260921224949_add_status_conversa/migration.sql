-- CreateEnum
CREATE TYPE "StatusConversa" AS ENUM ('AGUARDANDO_ATENDIMENTO', 'EM_ATENDIMENTO', 'FINALIZADO');

-- AlterTable
ALTER TABLE "cronogramaCursos" ALTER COLUMN "especificacao" DROP NOT NULL;
