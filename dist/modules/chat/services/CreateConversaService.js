"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConversaService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class CreateConversaService {
    async execute({ telefone, nome, aluno_id, professor_id, }) {
        const telefoneLimpo = telefone.replace(/\D/g, "");
        // =====================================================
        // PROCURA PRIMEIRO PELA CONVERSA VINCULADA AO ALUNO
        // =====================================================
        if (aluno_id) {
            const conversaAluno = await prisma_1.default.conversa.findFirst({
                where: {
                    aluno_id,
                },
            });
            if (conversaAluno) {
                // Atualiza o telefone caso o cadastro do aluno tenha mudado
                if (conversaAluno.telefone !==
                    telefoneLimpo) {
                    const conversaAtualizada = await prisma_1.default.conversa.update({
                        where: {
                            id: conversaAluno.id,
                        },
                        data: {
                            telefone: telefoneLimpo,
                            nome: nome ??
                                conversaAluno.nome,
                        },
                    });
                    return conversaAtualizada;
                }
                return conversaAluno;
            }
        }
        // =====================================================
        // CASO NÃO EXISTA ALUNO VINCULADO,
        // PROCURA PELO TELEFONE
        // =====================================================
        const conversaTelefone = await prisma_1.default.conversa.findFirst({
            where: {
                telefone: telefoneLimpo,
            },
        });
        if (conversaTelefone) {
            return conversaTelefone;
        }
        // =====================================================
        // CRIA UMA NOVA CONVERSA
        // =====================================================
        const conversa = await prisma_1.default.conversa.create({
            data: {
                telefone: telefoneLimpo,
                nome,
                aluno_id,
                professor_id,
                ultimaMensagem: "",
                ultimaData: new Date(),
                // Toda conversa nova começa aguardando atendimento
                status: "AGUARDANDO_ATENDIMENTO",
            },
        });
        return conversa;
    }
}
exports.CreateConversaService = CreateConversaService;
