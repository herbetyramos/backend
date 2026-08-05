/*
  Warnings:

  - You are about to drop the column `name` on the `cursos` table. All the data in the column will be lost.
  - Added the required column `nome_curso` to the `cursos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cursos" DROP COLUMN "name",
ADD COLUMN     "nome_curso" TEXT NOT NULL;
