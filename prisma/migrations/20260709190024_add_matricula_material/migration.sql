-- AlterTable
ALTER TABLE "aluno" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "Telefone_recado" DROP NOT NULL;

-- CreateTable
CREATE TABLE "matricula" (
    "id" TEXT NOT NULL,
    "id_cronograma" TEXT NOT NULL,
    "id_aluno" TEXT NOT NULL,
    "confirmacao_curso" BOOLEAN,
    "justificativa" TEXT,
    "confirmacao_formatura" BOOLEAN,
    "aprovado" BOOLEAN,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiais" (
    "id" TEXT NOT NULL,
    "id_curso" TEXT NOT NULL,
    "propriedade" TEXT NOT NULL,
    "nome_material" TEXT NOT NULL,
    "qtde" TEXT,

    CONSTRAINT "materiais_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_cronograma_fkey" FOREIGN KEY ("id_cronograma") REFERENCES "cronogramaCursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiais" ADD CONSTRAINT "materiais_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
