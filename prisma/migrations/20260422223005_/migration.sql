/*
  Warnings:

  - Added the required column `arps_id` to the `detentora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detentora" ADD COLUMN     "arps_id" TEXT NOT NULL;
