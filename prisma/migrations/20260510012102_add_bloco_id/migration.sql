/*
  Warnings:

  - You are about to drop the column `id_detentora` on the `ata` table. All the data in the column will be lost.
  - You are about to drop the column `curso_cronograma_id` on the `cronogramaCursos` table. All the data in the column will be lost.
  - You are about to drop the column `professores_id` on the `cronogramaCursos` table. All the data in the column will be lost.
  - You are about to drop the column `arps_id` on the `detentora` table. All the data in the column will be lost.
  - Added the required column `professor_id` to the `cronogramaCursos` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `cronogramaCursos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `cronogramaCursos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ata" DROP CONSTRAINT "ata_id_detentora_fkey";

-- DropForeignKey
ALTER TABLE "cronogramaCursos" DROP CONSTRAINT "cronogramaCursos_curso_cronograma_id_fkey";

-- DropForeignKey
ALTER TABLE "cronogramaCursos" DROP CONSTRAINT "cronogramaCursos_professores_id_fkey";

-- DropForeignKey
ALTER TABLE "detentora" DROP CONSTRAINT "detentora_arps_id_fkey";

-- AlterTable
ALTER TABLE "Local" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ata" DROP COLUMN "id_detentora",
ADD COLUMN     "id_empresa" TEXT;

-- AlterTable
ALTER TABLE "cronogramaCursos" DROP COLUMN "curso_cronograma_id",
DROP COLUMN "professores_id",
ADD COLUMN     "bloco_id" TEXT,
ADD COLUMN     "professor_id" TEXT NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "detentora" DROP COLUMN "arps_id",
ADD COLUMN     "ata_id" TEXT;

-- AddForeignKey
ALTER TABLE "ata" ADD CONSTRAINT "ata_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detentora" ADD CONSTRAINT "detentora_ata_id_fkey" FOREIGN KEY ("ata_id") REFERENCES "ata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_bloco_id_fkey" FOREIGN KEY ("bloco_id") REFERENCES "blocoCurso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
