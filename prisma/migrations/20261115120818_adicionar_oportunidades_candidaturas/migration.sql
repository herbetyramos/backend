-- CreateEnum
CREATE TYPE "StatusOportunidade" AS ENUM ('RASCUNHO', 'PUBLICADA', 'ENCERRADA');

-- CreateEnum
CREATE TYPE "StatusCandidatura" AS ENUM ('EM_ANALISE', 'CONTATADO', 'SELECIONADO', 'RECUSADO');

-- CreateTable
CREATE TABLE "oportunidade" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "requisitos" TEXT,
    "atividades" TEXT,
    "cidade" TEXT,
    "modalidade" TEXT,
    "tipoContratacao" TEXT,
    "jornada" TEXT,
    "salario" DECIMAL(10,2),
    "beneficios" TEXT,
    "prazoCandidatura" TIMESTAMP(3),
    "status" "StatusOportunidade" NOT NULL DEFAULT 'RASCUNHO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oportunidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatura" (
    "id" TEXT NOT NULL,
    "oportunidadeId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "status" "StatusCandidatura" NOT NULL DEFAULT 'EM_ANALISE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "oportunidade_empresaId_idx" ON "oportunidade"("empresaId");

-- CreateIndex
CREATE INDEX "oportunidade_status_idx" ON "oportunidade"("status");

-- CreateIndex
CREATE INDEX "oportunidade_prazoCandidatura_idx" ON "oportunidade"("prazoCandidatura");

-- CreateIndex
CREATE INDEX "candidatura_alunoId_idx" ON "candidatura"("alunoId");

-- CreateIndex
CREATE INDEX "candidatura_oportunidadeId_idx" ON "candidatura"("oportunidadeId");

-- CreateIndex
CREATE INDEX "candidatura_status_idx" ON "candidatura"("status");

-- CreateIndex
CREATE UNIQUE INDEX "candidatura_oportunidadeId_alunoId_key" ON "candidatura"("oportunidadeId", "alunoId");

-- AddForeignKey
ALTER TABLE "oportunidade" ADD CONSTRAINT "oportunidade_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa_parceira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatura" ADD CONSTRAINT "candidatura_oportunidadeId_fkey" FOREIGN KEY ("oportunidadeId") REFERENCES "oportunidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatura" ADD CONSTRAINT "candidatura_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
