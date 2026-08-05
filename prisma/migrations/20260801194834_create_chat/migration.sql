-- CreateTable
CREATE TABLE "Conversa" (
    "id" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nome" TEXT,
    "aluno_id" TEXT,
    "professor_id" TEXT,
    "ultimaMensagem" TEXT,
    "ultimaData" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" TEXT NOT NULL,
    "conversaId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "enviado" BOOLEAN NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversa_telefone_key" ON "Conversa"("telefone");

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "Conversa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
