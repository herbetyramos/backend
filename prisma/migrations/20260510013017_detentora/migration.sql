-- DropForeignKey
ALTER TABLE "cronogramaCursos" DROP CONSTRAINT "cronogramaCursos_detentora_id_fkey";

-- AlterTable
ALTER TABLE "cronogramaCursos" ADD COLUMN     "detentoras_id" TEXT;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_detentoras_id_fkey" FOREIGN KEY ("detentoras_id") REFERENCES "detentora"("id") ON DELETE SET NULL ON UPDATE CASCADE;
