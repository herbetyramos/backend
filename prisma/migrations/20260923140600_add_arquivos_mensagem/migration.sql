-- AlterTable
ALTER TABLE "Mensagem" ADD COLUMN     "arquivoUrl" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "nomeArquivo" TEXT,
ADD COLUMN     "tamanho" INTEGER,
ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'TEXTO';
