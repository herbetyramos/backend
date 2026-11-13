-- Banco de Talentos: estruturas independentes das empresas fornecedoras.
CREATE TYPE "StatusEmpresaParceira" AS ENUM ('PENDENTE', 'APROVADA', 'REPROVADA', 'SUSPENSA');

CREATE TABLE "empresa_parceira" (
  "id" TEXT NOT NULL,
  "razaoSocial" TEXT NOT NULL,
  "nomeFantasia" TEXT,
  "cnpj" TEXT NOT NULL,
  "representante" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "telefone" TEXT NOT NULL,
  "cidade" TEXT,
  "descricao" TEXT,
  "status" "StatusEmpresaParceira" NOT NULL DEFAULT 'PENDENTE',
  "motivoStatus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "empresa_parceira_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "empresa_parceira_cnpj_key" ON "empresa_parceira"("cnpj");
CREATE INDEX "empresa_parceira_status_idx" ON "empresa_parceira"("status");
CREATE INDEX "empresa_parceira_razaoSocial_idx" ON "empresa_parceira"("razaoSocial");

CREATE TABLE "usuario_empresa_parceira" (
  "id" TEXT NOT NULL,
  "empresaId" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senhaHash" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "usuario_empresa_parceira_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "usuario_empresa_parceira_email_key" ON "usuario_empresa_parceira"("email");
CREATE INDEX "usuario_empresa_parceira_empresaId_idx" ON "usuario_empresa_parceira"("empresaId");
ALTER TABLE "usuario_empresa_parceira" ADD CONSTRAINT "usuario_empresa_parceira_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa_parceira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "perfil_profissional" (
  "id" TEXT NOT NULL,
  "alunoId" TEXT NOT NULL,
  "objetivoProfissional" TEXT,
  "resumo" TEXT,
  "cidade" TEXT,
  "bairro" TEXT,
  "disponibilidade" TEXT,
  "curriculoUrl" TEXT,
  "telefoneContato" TEXT,
  "ativo" BOOLEAN NOT NULL DEFAULT false,
  "consentimentoEm" TIMESTAMP(3),
  "consentimentoRevogadoEm" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "perfil_profissional_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "perfil_profissional_alunoId_key" ON "perfil_profissional"("alunoId");
ALTER TABLE "perfil_profissional" ADD CONSTRAINT "perfil_profissional_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "acesso_aluno_talentos" (
  "id" TEXT NOT NULL,
  "alunoId" TEXT NOT NULL,
  "codigoHash" TEXT,
  "codigoExpira" TIMESTAMP(3),
  "codigoUsadoEm" TIMESTAMP(3),
  "senhaHash" TEXT,
  "tentativas" INTEGER NOT NULL DEFAULT 0,
  "bloqueadoAte" TIMESTAMP(3),
  "ultimoAcesso" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "acesso_aluno_talentos_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "acesso_aluno_talentos_alunoId_key" ON "acesso_aluno_talentos"("alunoId");
ALTER TABLE "acesso_aluno_talentos" ADD CONSTRAINT "acesso_aluno_talentos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
