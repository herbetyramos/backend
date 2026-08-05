-- CreateTable
CREATE TABLE "segmentos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segmentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "segmento_id" TEXT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "nome_professor" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "Numero" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id" TEXT NOT NULL,
    "nome_empresa" TEXT NOT NULL,
    "representante" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "CNPJ" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licitacao" (
    "id" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "numero_licitacao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ata" (
    "id" TEXT NOT NULL,
    "numero_ata" TEXT NOT NULL,
    "licitacao_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detentoras" (
    "id" TEXT NOT NULL,
    "empresa_detentora" TEXT NOT NULL,
    "arps_id" TEXT NOT NULL,
    "cursos_id" TEXT NOT NULL,

    CONSTRAINT "detentoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Local" (
    "id" TEXT NOT NULL,
    "polo" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Telefone2" TEXT NOT NULL,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sala" (
    "id" TEXT NOT NULL,
    "numero_sala" TEXT NOT NULL,
    "tipo_uso" TEXT NOT NULL,
    "local_id" TEXT NOT NULL,

    CONSTRAINT "sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formatura" (
    "id" TEXT NOT NULL,
    "data_formatura" TEXT NOT NULL,
    "local" TEXT NOT NULL,

    CONSTRAINT "formatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocoCurso" (
    "id" TEXT NOT NULL,
    "bloco_Curso" TEXT NOT NULL,

    CONSTRAINT "blocoCurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cronogramaCursos" (
    "id" TEXT NOT NULL,
    "curso_cronograma_id" TEXT NOT NULL,
    "detentora_id" TEXT NOT NULL,
    "professores_id" TEXT NOT NULL,
    "local_id" TEXT NOT NULL,
    "sala_id" TEXT NOT NULL,
    "formatura_id" TEXT NOT NULL,
    "data_inicio" TEXT NOT NULL,
    "data_fim" TEXT NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fim" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "is_status" TEXT NOT NULL,
    "especificacao" TEXT NOT NULL,
    "publicar" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "quantidade_aluno" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cronogramaCursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planejamentoAulas" (
    "id" TEXT NOT NULL,
    "planeja_id" TEXT NOT NULL,
    "Planejamento_Aula" TEXT NOT NULL,

    CONSTRAINT "planejamentoAulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "Telefone_recado" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_segmento_id_fkey" FOREIGN KEY ("segmento_id") REFERENCES "segmentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ata" ADD CONSTRAINT "ata_licitacao_id_fkey" FOREIGN KEY ("licitacao_id") REFERENCES "licitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detentoras" ADD CONSTRAINT "detentoras_arps_id_fkey" FOREIGN KEY ("arps_id") REFERENCES "ata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detentoras" ADD CONSTRAINT "detentoras_cursos_id_fkey" FOREIGN KEY ("cursos_id") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sala" ADD CONSTRAINT "sala_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_curso_cronograma_id_fkey" FOREIGN KEY ("curso_cronograma_id") REFERENCES "blocoCurso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_detentora_id_fkey" FOREIGN KEY ("detentora_id") REFERENCES "detentoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_professores_id_fkey" FOREIGN KEY ("professores_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronogramaCursos" ADD CONSTRAINT "cronogramaCursos_formatura_id_fkey" FOREIGN KEY ("formatura_id") REFERENCES "formatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planejamentoAulas" ADD CONSTRAINT "planejamentoAulas_planeja_id_fkey" FOREIGN KEY ("planeja_id") REFERENCES "cronogramaCursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
