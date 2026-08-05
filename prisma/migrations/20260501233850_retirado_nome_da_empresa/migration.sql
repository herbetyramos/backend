/*
  Warnings:

  - You are about to drop the column `detentoraId` on the `ata` table. All the data in the column will be lost.
  - You are about to drop the column `empresa_detentora` on the `detentora` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ata" DROP CONSTRAINT "ata_detentoraId_fkey";

-- AlterTable
ALTER TABLE "ata" DROP COLUMN "detentoraId";

-- AlterTable
ALTER TABLE "detentora" DROP COLUMN "empresa_detentora";
