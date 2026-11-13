
import prismaClient from "../../../prisma";
import EnviarWhatsAppService from "../../../whatsapp/services/EnviarWhatsAppService";

interface EnviarMensagemProfessoresRequest {
  cronogramaId: string;
  professoresIds: string[];
  texto?: string;
  arquivo?: Buffer;
  mimeType?: string;
  nomeArquivo?: string;
}

interface ResultadoEnvio {
  professorId: string;
  nome: string;
  telefone: string;
  status: "ENVIADO" | "ERRO";
  mensagemErro?: string;
}

class EnviarMensagemProfessoresService {
  async listarProfessores(cronogramaId: string) {
    if (!cronogramaId) {
      throw new Error("Cronograma não informado.");
    }

    const cronograma =
      await prismaClient.cronogramaCurso.findUnique({
        where: {
          id: cronogramaId,
        },
        select: {
          bloco_id: true,
        },
      });

    if (!cronograma) {
      throw new Error("Cronograma não encontrado.");
    }

    if (!cronograma.bloco_id) {
      throw new Error(
        "Este cronograma não está vinculado a um bloco."
      );
    }

    const cronogramas =
      await prismaClient.cronogramaCurso.findMany({
        where: {
          bloco_id: cronograma.bloco_id,
          professor_id: {
            not: null,
          },
        },
        select: {
          professor: {
            select: {
              id: true,
              nome_professor: true,
              telefone: true,
            },
          },
        },
      });

    const professoresMap = new Map<
      string,
      {
        id: string;
        nome: string;
        telefone: string;
      }
    >();

    for (const item of cronogramas) {
      const professor = item.professor;

      if (!professor) {
        continue;
      }

      if (professoresMap.has(professor.id)) {
        continue;
      }

      professoresMap.set(professor.id, {
        id: professor.id,
        nome: professor.nome_professor,
        telefone: professor.telefone,
      });
    }

    return Array.from(professoresMap.values()).sort(
      (a, b) => a.nome.localeCompare(b.nome, "pt-BR")
    );
  }

  async enviar({
    cronogramaId,
    professoresIds,
    texto,
    arquivo,
    mimeType,
    nomeArquivo,
  }: EnviarMensagemProfessoresRequest) {
    const textoLimpo = texto?.trim() || "";
    const possuiArquivo = !!arquivo && arquivo.length > 0;

    if (!textoLimpo && !possuiArquivo) {
      throw new Error(
        "Informe uma mensagem ou selecione um arquivo."
      );
    }

    if (possuiArquivo && (!mimeType || !nomeArquivo)) {
      throw new Error(
        "Não foi possível identificar o arquivo enviado."
      );
    }

    const idsUnicos = Array.from(new Set(professoresIds));

    if (idsUnicos.length === 0) {
      throw new Error("Selecione pelo menos um professor.");
    }

    const professores =
      await this.listarProfessores(cronogramaId);

    const professoresSelecionados = professores.filter(
      (professor) => idsUnicos.includes(professor.id)
    );

    if (professoresSelecionados.length !== idsUnicos.length) {
      throw new Error(
        "Um ou mais professores selecionados não pertencem ao bloco deste cronograma."
      );
    }

    const resultados: ResultadoEnvio[] = [];

    // Envio sequencial para evitar sobrecarregar a conexão WhatsApp.
    for (const professor of professoresSelecionados) {
      try {
        if (!professor.telefone?.trim()) {
          throw new Error("Professor sem telefone cadastrado.");
        }

        await EnviarWhatsAppService.execute(
          professor.telefone,
          textoLimpo || undefined,
          arquivo,
          mimeType,
          nomeArquivo
        );

        resultados.push({
          professorId: professor.id,
          nome: professor.nome,
          telefone: professor.telefone,
          status: "ENVIADO",
        });
      } catch (error) {
        resultados.push({
          professorId: professor.id,
          nome: professor.nome,
          telefone: professor.telefone,
          status: "ERRO",
          mensagemErro:
            error instanceof Error
              ? error.message
              : "Erro ao enviar mensagem.",
        });
      }
    }

    const enviados = resultados.filter(
      (resultado) => resultado.status === "ENVIADO"
    ).length;

    const falhas = resultados.length - enviados;

    return {
      total: resultados.length,
      enviados,
      falhas,
      resultados,
    };
  }
}

export { EnviarMensagemProfessoresService };
