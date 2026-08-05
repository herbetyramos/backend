/*
  Warnings:

  - You are about to drop the column `Planejamento_Aula` on the `planejamentoAulas` table. All the data in the column will be lost.
  - Added the required column `conteudo` to the `planejamentoAulas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_aula` to the `planejamentoAulas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dia` to the `planejamentoAulas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `planejamentoAulas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "planejamentoAulas" DROP COLUMN "Planejamento_Aula",
ADD COLUMN     "conteudo" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_aula" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dia" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
