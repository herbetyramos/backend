"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bancoTalentosRoutes = void 0;
const express_1 = require("express");
const crypto_1 = require("crypto");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../../prisma"));
const IsAuthenticated_1 = require("../../middleware/IsAuthenticated");
const router = (0, express_1.Router)();
exports.bancoTalentosRoutes = router;
const TOKEN_SECRET = process.env.JWS_SECRET;
const CODIGO_HORAS_VALIDADE = 48;
const MAX_TENTATIVAS = 5;
function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}
function formatarCpf(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function cpfValido(cpf) {
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf))
        return false;
    const calcular = (base, pesoInicial) => {
        let soma = 0;
        for (let i = 0; i < base.length; i += 1)
            soma += Number(base[i]) * (pesoInicial - i);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };
    return calcular(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
        calcular(cpf.slice(0, 10), 11) === Number(cpf[10]);
}
async function localizarAlunoElegivel(cpfInformado) {
    const cpf = somenteNumeros(cpfInformado);
    if (!cpfValido(cpf))
        return null;
    const aluno = await prisma_1.default.aluno.findFirst({
        where: { OR: [{ CPF: cpf }, { CPF: formatarCpf(cpf) }] },
        include: { matriculas: { where: { aprovado: true }, select: { id: true } } },
    });
    if (!aluno || aluno.matriculas.length === 0)
        return null;
    return aluno;
}
function gerarTokenAluno(alunoId, nome) {
    return (0, jsonwebtoken_1.sign)({ tipo: "aluno", nome }, TOKEN_SECRET, {
        subject: alunoId,
        expiresIn: "12h",
    });
}
// Secretaria: lista somente alunos com ao menos uma matrícula aprovada.
router.get("/banco-talentos/admin/alunos-elegiveis", IsAuthenticated_1.IsAuthenticated, async (_req, res) => {
    const alunos = await prisma_1.default.aluno.findMany({
        where: { matriculas: { some: { aprovado: true } } },
        select: {
            id: true,
            nome: true,
            CPF: true,
            email: true,
            celular: true,
            matriculas: {
                where: { aprovado: true },
                select: {
                    id: true,
                    cronograma: {
                        select: { tema: true, data_fim: true, detentoras: { select: { curso: { select: { nome_curso: true } } } } },
                    },
                },
            },
            acessoBancoTalentos: { select: { senhaHash: true, codigoExpira: true, codigoUsadoEm: true } },
            perfilProfissional: { select: { ativo: true } },
        },
        orderBy: { nome: "asc" },
    });
    return res.json(alunos.map((aluno) => ({
        ...aluno,
        acessoAtivado: Boolean(aluno.acessoBancoTalentos?.senhaHash),
        codigoPendente: Boolean(aluno.acessoBancoTalentos?.codigoExpira && !aluno.acessoBancoTalentos?.codigoUsadoEm),
        acessoBancoTalentos: undefined,
    })));
});
// Secretaria: emite um código de uso único, válido por 48 horas.
router.post("/banco-talentos/admin/alunos/:alunoId/codigo-ativacao", IsAuthenticated_1.IsAuthenticated, async (req, res) => {
    const { alunoId } = req.params;
    const aluno = await prisma_1.default.aluno.findFirst({
        where: { id: alunoId, matriculas: { some: { aprovado: true } } },
        select: { id: true, nome: true },
    });
    if (!aluno)
        return res.status(404).json({ error: "Aluno não encontrado ou sem matrícula aprovada." });
    const acessoAtual = await prisma_1.default.acessoAlunoTalentos.findUnique({ where: { alunoId } });
    if (acessoAtual?.senhaHash) {
        return res.status(409).json({ error: "Este aluno já ativou o acesso. A recuperação de senha será disponibilizada em uma etapa posterior." });
    }
    const codigo = (0, crypto_1.randomBytes)(4).toString("hex").toUpperCase();
    const codigoHash = await (0, bcryptjs_1.hash)(codigo, 10);
    const codigoExpira = new Date(Date.now() + CODIGO_HORAS_VALIDADE * 60 * 60 * 1000);
    await prisma_1.default.acessoAlunoTalentos.upsert({
        where: { alunoId },
        create: { alunoId, codigoHash, codigoExpira, tentativas: 0, senhaHash: null, codigoUsadoEm: null, bloqueadoAte: null },
        update: { codigoHash, codigoExpira, codigoUsadoEm: null, tentativas: 0, bloqueadoAte: null },
    });
    return res.status(201).json({ aluno: aluno.nome, codigo, validadeHoras: CODIGO_HORAS_VALIDADE, mensagem: "Copie e entregue o código ao aluno. Ele será exibido somente nesta resposta." });
});
// Secretaria: cadastro de empresa empregadora (não utiliza a tabela empresa).
router.post("/banco-talentos/admin/empresas", IsAuthenticated_1.IsAuthenticated, async (req, res) => {
    const razaoSocial = String(req.body.razaoSocial ?? "").trim();
    const nomeFantasia = String(req.body.nomeFantasia ?? "").trim() || null;
    const cnpj = somenteNumeros(String(req.body.cnpj ?? ""));
    const representante = String(req.body.representante ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const telefone = String(req.body.telefone ?? "").trim();
    const cidade = String(req.body.cidade ?? "").trim() || null;
    const descricao = String(req.body.descricao ?? "").trim() || null;
    if (!razaoSocial || !representante || !email || !telefone || !/^\d{14}$/.test(cnpj)) {
        return res.status(400).json({ error: "Informe razão social, CNPJ com 14 dígitos, representante, e-mail e telefone." });
    }
    const existente = await prisma_1.default.empresaParceira.findUnique({ where: { cnpj } });
    if (existente)
        return res.status(409).json({ error: "Já existe uma empresa empregadora cadastrada com este CNPJ." });
    const empresa = await prisma_1.default.empresaParceira.create({
        data: { razaoSocial, nomeFantasia, cnpj, representante, email, telefone, cidade, descricao },
    });
    return res.status(201).json(empresa);
});
router.get("/banco-talentos/admin/empresas", IsAuthenticated_1.IsAuthenticated, async (_req, res) => {
    const empresas = await prisma_1.default.empresaParceira.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(empresas);
});
router.patch("/banco-talentos/admin/empresas/:id/status", IsAuthenticated_1.IsAuthenticated, async (req, res) => {
    const status = String(req.body.status ?? "");
    const permitidos = ["PENDENTE", "APROVADA", "REPROVADA", "SUSPENSA"];
    if (!permitidos.includes(status))
        return res.status(400).json({ error: "Status inválido." });
    const motivoStatus = String(req.body.motivoStatus ?? "").trim() || null;
    const empresa = await prisma_1.default.empresaParceira.update({
        where: { id: req.params.id },
        data: { status: status, motivoStatus },
    });
    return res.json(empresa);
});
// Aluno: primeiro acesso. Respostas genéricas evitam revelar se o CPF está cadastrado.
router.post("/banco-talentos/aluno/ativar", async (req, res) => {
    const cpf = String(req.body.cpf ?? "");
    const codigo = String(req.body.codigo ?? "").trim().toUpperCase();
    const senha = String(req.body.senha ?? "");
    if (senha.length < 8)
        return res.status(400).json({ error: "A senha deve ter pelo menos 8 caracteres." });
    const aluno = await localizarAlunoElegivel(cpf);
    if (!aluno)
        return res.status(400).json({ error: "Não foi possível validar os dados informados. Procure a Secretaria." });
    const acesso = await prisma_1.default.acessoAlunoTalentos.findUnique({ where: { alunoId: aluno.id } });
    const agora = new Date();
    if (!acesso || !acesso.codigoHash || !acesso.codigoExpira || acesso.codigoUsadoEm || acesso.senhaHash || acesso.codigoExpira <= agora || (acesso.bloqueadoAte && acesso.bloqueadoAte > agora)) {
        return res.status(400).json({ error: "Não foi possível validar os dados informados. Solicite um novo código à Secretaria." });
    }
    const codigoCorreto = await (0, bcryptjs_1.compare)(codigo, acesso.codigoHash);
    if (!codigoCorreto) {
        const tentativas = acesso.tentativas + 1;
        await prisma_1.default.acessoAlunoTalentos.update({
            where: { alunoId: aluno.id },
            data: { tentativas, bloqueadoAte: tentativas >= MAX_TENTATIVAS ? new Date(Date.now() + 30 * 60 * 1000) : null },
        });
        return res.status(400).json({ error: "Não foi possível validar os dados informados. Confira o código ou procure a Secretaria." });
    }
    const senhaHash = await (0, bcryptjs_1.hash)(senha, 12);
    await prisma_1.default.$transaction([
        prisma_1.default.acessoAlunoTalentos.update({
            where: { alunoId: aluno.id },
            data: { senhaHash, codigoHash: null, codigoUsadoEm: agora, codigoExpira: null, tentativas: 0, bloqueadoAte: null, ultimoAcesso: agora },
        }),
        prisma_1.default.perfilProfissional.upsert({
            where: { alunoId: aluno.id },
            create: { alunoId: aluno.id },
            update: {},
        }),
    ]);
    return res.status(201).json({ token: gerarTokenAluno(aluno.id, aluno.nome), aluno: { id: aluno.id, nome: aluno.nome } });
});
router.post("/banco-talentos/aluno/login", async (req, res) => {
    const aluno = await localizarAlunoElegivel(String(req.body.cpf ?? ""));
    if (!aluno)
        return res.status(401).json({ error: "CPF ou senha inválidos." });
    const acesso = await prisma_1.default.acessoAlunoTalentos.findUnique({ where: { alunoId: aluno.id } });
    const agora = new Date();
    if (!acesso?.senhaHash || (acesso.bloqueadoAte && acesso.bloqueadoAte > agora)) {
        return res.status(401).json({ error: "CPF ou senha inválidos." });
    }
    const senhaCorreta = await (0, bcryptjs_1.compare)(String(req.body.senha ?? ""), acesso.senhaHash);
    if (!senhaCorreta) {
        const tentativas = acesso.tentativas + 1;
        await prisma_1.default.acessoAlunoTalentos.update({ where: { alunoId: aluno.id }, data: { tentativas, bloqueadoAte: tentativas >= MAX_TENTATIVAS ? new Date(Date.now() + 15 * 60 * 1000) : null } });
        return res.status(401).json({ error: "CPF ou senha inválidos." });
    }
    await prisma_1.default.acessoAlunoTalentos.update({ where: { alunoId: aluno.id }, data: { tentativas: 0, bloqueadoAte: null, ultimoAcesso: agora } });
    return res.json({ token: gerarTokenAluno(aluno.id, aluno.nome), aluno: { id: aluno.id, nome: aluno.nome } });
});
function IsAlunoAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Faça login para continuar." });
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token)
        return res.status(401).json({ error: "Token inválido." });
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, TOKEN_SECRET);
        if (payload.tipo !== "aluno" || !payload.sub)
            return res.status(403).json({ error: "Acesso exclusivo do aluno." });
        req.aluno_id = payload.sub;
        return next();
    }
    catch {
        return res.status(401).json({ error: "Sessão expirada. Entre novamente." });
    }
}
router.get("/banco-talentos/aluno/me", IsAlunoAuthenticated, async (req, res) => {
    const aluno = await prisma_1.default.aluno.findUnique({
        where: { id: req.aluno_id },
        select: {
            id: true,
            nome: true,
            email: true,
            celular: true,
            CPF: true,
            matriculas: {
                where: { aprovado: true },
                select: {
                    id: true,
                    cronograma: {
                        select: {
                            tema: true,
                            data_inicio: true,
                            data_fim: true,
                            detentoras: {
                                select: {
                                    curso: {
                                        select: {
                                            nome_curso: true,
                                            segmento: { select: { name: true } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            perfilProfissional: true,
        },
    });
    if (!aluno || aluno.matriculas.length === 0)
        return res.status(403).json({ error: "Aluno não possui matrícula aprovada." });
    return res.json(aluno);
});
router.put("/banco-talentos/aluno/perfil", IsAlunoAuthenticated, async (req, res) => {
    const objetivoProfissional = String(req.body.objetivoProfissional ?? "").trim() || null;
    const resumo = String(req.body.resumo ?? "").trim() || null;
    const cidade = String(req.body.cidade ?? "").trim() || null;
    const bairro = String(req.body.bairro ?? "").trim() || null;
    const disponibilidade = String(req.body.disponibilidade ?? "").trim() || null;
    const telefoneContato = String(req.body.telefoneContato ?? "").trim() || null;
    const consentir = req.body.consentir === true;
    const alunoElegivel = await prisma_1.default.aluno.findFirst({ where: { id: req.aluno_id, matriculas: { some: { aprovado: true } } }, select: { id: true } });
    if (!alunoElegivel)
        return res.status(403).json({ error: "Aluno não possui matrícula aprovada." });
    const perfilAtual = await prisma_1.default.perfilProfissional.findUnique({ where: { alunoId: req.aluno_id } });
    const agora = new Date();
    const perfil = await prisma_1.default.perfilProfissional.upsert({
        where: { alunoId: req.aluno_id },
        create: {
            alunoId: req.aluno_id,
            objetivoProfissional,
            resumo,
            cidade,
            bairro,
            disponibilidade,
            telefoneContato,
            ativo: consentir,
            consentimentoEm: consentir ? agora : null,
        },
        update: {
            objetivoProfissional,
            resumo,
            cidade,
            bairro,
            disponibilidade,
            telefoneContato,
            ativo: consentir,
            consentimentoEm: consentir ? (perfilAtual?.consentimentoEm ?? agora) : (perfilAtual?.consentimentoEm ?? null),
            consentimentoRevogadoEm: consentir ? null : (perfilAtual?.ativo ? agora : (perfilAtual?.consentimentoRevogadoEm ?? null)),
        },
    });
    return res.json(perfil);
});
