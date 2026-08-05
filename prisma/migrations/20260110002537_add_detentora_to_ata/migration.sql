/*
  Warnings:

  - You are about to drop the `Professor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detentoras` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_detentora` to the `ata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cronogramaCursos" DROP CONSTRAINT "cronogramaCursos_detentora_id_fkey";

-- DropForeignKey
ALTER TABLE "cronogramaCursos" DROP CONSTRAINT "cronogramaCursos_professores_id_fkey";

-- DropForeignKey
ALTER TABLE "detentoras" DROP CONSTRAINT "detentoras_arps_id_fkey";

-- DropForeignKey
ALTER TABLE "detentoras" DROP CONSTRAINT "detentoras_cursos_id_fkey";

-- AlterTable
ALTER TABLE "ata" ADD COLUMN     "id_detentora" TEXT NOT NULL;

-- DropTable
DROP TABLE "Professor";

-- DropTable
DROP TABLE "detentoras";

-- CreateTable
CREATE TABLE "professor" (
    "id" TEXT NOT NULL,
    "nome_professor" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "Numero" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detentora" (
    "id" TEXT NOT NULL,
    "empresa_detentora" TEXT NOT NULL,
    "cursos_id" TEXT NOT NULL,

    CONSTRAINT "detentora_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ata" ADD CONSTRAINT "ata_id_detentora_fkey" FOREIGN KEY ("id_detentora") REFERENCES "detentora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detentora" ADD CONSTRAINT "detentora_cursos_id_fkey" FOREIGN KEY ("cursos_id") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_detentora_id_fkey" FOREIGN KEY ("detentora_id") REFERENCES "detentora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_professores_id_fkey" FOREIGN KEY ("professores_id") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
