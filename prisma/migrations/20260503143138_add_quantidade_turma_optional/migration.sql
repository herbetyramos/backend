-- AlterTable
ALTER TABLE "detentora" ADD COLUMN     "quantidade_turma" INTEGER;

-- AddForeignKey
ALTER TABLE "detentora" ADD CONSTRAINT "detentora_arps_id_fkey" FOREIGN KEY ("arps_id") REFERENCES "ata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
