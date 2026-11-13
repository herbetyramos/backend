"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceCronograma = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceCronograma {
    async execute({ bloco_id, detentoras_id, professor_id, local_id, sala_id, formatura_id, data_inicio, data_fim, hora_inicio, hora_fim, tema, is_status, especificacao, publicar, draft, quantidade_aluno, link_inscricao, imagem_url, }) {
        // ======================================================
        // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
        // ======================================================
        const required = {
            local_id,
            sala_id,
            formatura_id,
            data_inicio,
            data_fim,
            hora_inicio,
            hora_fim,
            tema,
            is_status,
        };
        for (const [key, value] of Object.entries(required)) {
            if (value === undefined ||
                value === null ||
                String(value).trim() === "") {
                throw new Error(`Campo obrigatório ausente: ${key}`);
            }
        }
        // ======================================================
        // CAMPOS OPCIONAIS
        // ======================================================
        // Especificação é opcional.
        // Se não for informada, salva como string vazia.
        const especificacaoFinal = especificacao?.trim() ?? "";
        // Quantidade de alunos não é mais obrigatória
        // no formulário atual.
        //
        // Caso o campo seja obrigatório no banco,
        // usamos "0" para manter compatibilidade.
        const quantidadeAlunoFinal = quantidade_aluno?.trim() || "0";
        // ======================================================
        // VALIDAÇÃO DO SALDO DA DETENTORA
        // ======================================================
        if (detentoras_id) {
            const detentora = await prisma_1.default.detentora.findUnique({
                where: {
                    id: detentoras_id,
                },
                select: {
                    id: true,
                    quantidade_turma: true,
                    curso: {
                        select: {
                            nome_curso: true,
                        },
                    },
                },
            });
            if (!detentora) {
                throw new Error("Detentora não encontrada.");
            }
            // ====================================================
            // CONTAR TURMAS JÁ UTILIZADAS
            // ====================================================
            const utilizadas = await prisma_1.default.cronogramaCurso.count({
                where: {
                    detentoras_id,
                    is_status: {
                        not: "CANCELADO",
                    },
                },
            });
            const contratado = detentora.quantidade_turma ?? 0;
            // ====================================================
            // VERIFICAR CONTRATADO
            // ====================================================
            if (contratado <= 0) {
                throw new Error(`A detentora não possui quantidade de turmas cadastrada para o curso ${detentora.curso.nome_curso}.`);
            }
            // ====================================================
            // VERIFICAR SALDO
            // ====================================================
            if (utilizadas >= contratado) {
                throw new Error(`Saldo de turmas esgotado para o curso ${detentora.curso.nome_curso}. Contratadas: ${contratado} | Utilizadas: ${utilizadas}.`);
            }
        }
        // ======================================================
        // CRIAÇÃO DO CRONOGRAMA
        // ======================================================
        try {
            const cronograma = await prisma_1.default.cronogramaCurso.create({
                data: {
                    // ==================================================
                    // RELACIONAMENTOS
                    // ==================================================
                    bloco_id: bloco_id || null,
                    detentoras_id: detentoras_id || null,
                    professor_id: professor_id || null,
                    local_id,
                    sala_id,
                    formatura_id,
                    // ==================================================
                    // DATAS
                    // ==================================================
                    data_inicio,
                    data_fim,
                    // ==================================================
                    // HORÁRIOS
                    // ==================================================
                    hora_inicio,
                    hora_fim,
                    // ==================================================
                    // DADOS DO CRONOGRAMA
                    // ==================================================
                    tema,
                    is_status,
                    especificacao: especificacaoFinal,
                    // ==================================================
                    // PUBLICAÇÃO
                    // ==================================================
                    publicar: publicar ?? false,
                    draft: draft ?? false,
                    // ==================================================
                    // QUANTIDADE DE ALUNOS
                    // ==================================================
                    quantidade_aluno: quantidadeAlunoFinal,
                    // ==================================================
                    // LINK DE INSCRIÇÃO
                    // ==================================================
                    link_inscricao: link_inscricao?.trim() || null,
                    // ==================================================
                    // IMAGEM
                    // ==================================================
                    imagem_url: imagem_url?.trim() || null,
                },
                // ====================================================
                // CAMPOS RETORNADOS
                // ====================================================
                select: {
                    id: true,
                    codigo: true,
                    bloco_id: true,
                    detentoras_id: true,
                    professor_id: true,
                    local_id: true,
                    sala_id: true,
                    formatura_id: true,
                    data_inicio: true,
                    data_fim: true,
                    hora_inicio: true,
                    hora_fim: true,
                    tema: true,
                    is_status: true,
                    especificacao: true,
                    publicar: true,
                    draft: true,
                    quantidade_aluno: true,
                    link_inscricao: true,
                    imagem_url: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            return cronograma;
        }
        catch (err) {
            console.error("Erro Prisma ao criar cronograma:", err);
            const mensagem = err instanceof Error
                ? err.message
                : "Erro desconhecido";
            throw new Error("Erro ao criar cronograma: " +
                mensagem);
        }
    }
}
exports.CreateServiceCronograma = CreateServiceCronograma;
