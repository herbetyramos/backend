-- DropForeignKey
ALTER TABLE "ata" DROP CONSTRAINT "ata_id_detentora_fkey";

-- AlterTable
ALTER TABLE "ata" ADD COLUMN     "detentoraId" TEXT;

-- AddForeignKey
ALTER TABLE "ata" ADD CONSTRAINT "ata_id_detentora_fkey" FOREIGN KEY ("id_detentora") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ata" ADD CONSTRAINT "ata_detentoraId_fkey" FOREIGN KEY ("detentoraId") REFERENCES "detentora"("id") ON DELETE SET NULL ON UPDATE CASCADE;
