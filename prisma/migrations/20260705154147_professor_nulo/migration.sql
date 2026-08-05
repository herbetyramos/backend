-- DropForeignKey
ALTER TABLE "cronogramaCursos" DROP CONSTRAINT "cronogramaCursos_professor_id_fkey";

-- AlterTable
ALTER TABLE "cronogramaCursos" ALTER COLUMN "professor_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
