import {get, onValue, push, ref, remove, serverTimestamp, update} from "firebase/database";
import {firebaseDatabase} from "@dominio/firebase/app";
import type {
    ComprovantePagamentoDto,
    InscricaoRequestDto,
    PagamentoDto,
    StatusPagamento,
} from "@dominio/dto/inscricaoDto";

const INSCRICOES_PATH = "inscricoes";

type NormalizedInscricao = InscricaoRequestDto & {
    criadoEm: ReturnType<typeof serverTimestamp>;
};

const normalizarPayload = (payload: InscricaoRequestDto): NormalizedInscricao => ({
    ...payload,
    statusPagamento: payload.statusPagamento ?? "PENDENTE",
    pagamento: payload.pagamento ?? null,
    responsavelLegal: payload.responsavelLegal ?? null,
    alergiasIntolerancias: payload.alergiasIntolerancias ?? null,
    necessidadesEspeciais: payload.necessidadesEspeciais ?? null,
    comprovantePagamento: payload.comprovantePagamento ?? null,
    observacoes: payload.observacoes ?? null,
    criadoEm: serverTimestamp(),
});

const normalizarStatusPagamento = (valor: unknown): StatusPagamento => {
    switch (valor) {
        case "PROCESSANDO":
        case "PAGO":
        case "ERRO":
        case "PENDENTE":
            return valor;
        default:
            return "PENDENTE";
    }
};

const normalizarPagamentoValor = (valor: unknown): PagamentoDto | null => {
    if (!valor || typeof valor !== "object") {
        return null;
    }

    const registro = valor as Record<string, unknown>;
    const valorNumero =
        typeof registro.valor === "number"
            ? registro.valor
            : typeof registro.valor === "string"
              ? Number.parseFloat(registro.valor)
              : 0;
    const atualizadoEm =
        typeof registro.atualizadoEm === "number" ? registro.atualizadoEm : null;

    return {
        valor: Number.isFinite(valorNumero) ? valorNumero : 0,
        status: normalizarStatusPagamento(registro.status),
        detalhe: typeof registro.detalhe === "string" ? registro.detalhe : null,
        gateway: typeof registro.gateway === "string" ? registro.gateway : null,
        transacaoId: typeof registro.transacaoId === "string" ? registro.transacaoId : null,
        atualizadoEm,
    };
};

const normalizarComprovanteValor = (valor: unknown): ComprovantePagamentoDto | null => {
    if (!valor) {
        return null;
    }
    if (typeof valor === "string") {
        const ehUrl = valor.startsWith("http");
        return {
            nomeArquivo: ehUrl ? "comprovante-pix" : valor,
            url: ehUrl ? valor : "",
            conteudoBase64: ehUrl ? undefined : valor,
            enviadoEm: "",
            mimeType: "application/octet-stream",
        };
    }
    if (typeof valor === "object") {
        const registro = valor as Record<string, unknown>;
        const nomeArquivo =
            typeof registro.nomeArquivo === "string"
                ? registro.nomeArquivo
                : typeof registro.nome === "string"
                  ? registro.nome
                  : "";
        const url = typeof registro.url === "string" ? registro.url : "";
        const caminhoStorage =
            typeof registro.caminhoStorage === "string" ? registro.caminhoStorage : "";
        const conteudoBase64 =
            typeof registro.conteudoBase64 === "string" ? registro.conteudoBase64 : "";
        const enviadoEm = typeof registro.enviadoEm === "string" ? registro.enviadoEm : "";
        const mimeType =
            typeof registro.mimeType === "string"
                ? registro.mimeType
                : "application/octet-stream";
        if (!nomeArquivo && !url && !conteudoBase64) {
            return null;
        }
        return {
            nomeArquivo: nomeArquivo || (url ? "comprovante-pix" : ""),
            url,
            caminhoStorage,
            conteudoBase64: conteudoBase64 || undefined,
            enviadoEm,
            mimeType,
        };
    }
    return null;
};

export const salvarInscricao = async (payload: InscricaoRequestDto): Promise<string> => {
    const referencia = ref(firebaseDatabase, INSCRICOES_PATH);
    const novaInscricao = await push(referencia, normalizarPayload(payload));
    if (!novaInscricao.key) {
        throw new Error("Não foi possível obter o identificador da inscrição gerada.");
    }
    return novaInscricao.key;
};

export type InscricaoRegistrada = InscricaoRequestDto & {
    id: string;
    criadoEm?: number;
};

export const listarInscricoes = async (): Promise<InscricaoRegistrada[]> => {
    const snapshot = await get(ref(firebaseDatabase, INSCRICOES_PATH));
    if (!snapshot.exists()) {
        return [];
    }
    const dados = snapshot.val() as Record<string, any>;
    return Object.entries(dados).map(([id, valor]) => {
        const idadeNumero = Number.parseInt(valor?.idade ?? "0", 10);
        const criadoEmNumero =
            typeof valor?.criadoEm === "number" ? valor.criadoEm : undefined;
        const comprovantePagamento = normalizarComprovanteValor(valor?.comprovantePagamento);
        const pagamento = normalizarPagamentoValor(valor?.pagamento);
        const statusPagamento = normalizarStatusPagamento(valor?.statusPagamento ?? pagamento?.status);
        return {
            id,
            ...valor,
            idade: Number.isNaN(idadeNumero) ? 0 : idadeNumero,
            criadoEm: criadoEmNumero,
            statusPagamento,
            pagamento,
            comprovantePagamento,
        } as InscricaoRegistrada;
    });
};

export const observarInscricao = (
    inscricaoId: string,
    onChange: (inscricao: InscricaoRegistrada | null) => void,
    onError?: (error: Error) => void,
): (() => void) => {
    const referencia = ref(firebaseDatabase, `${INSCRICOES_PATH}/${inscricaoId}`);
    const unsubscribe = onValue(
        referencia,
        (snapshot) => {
            if (!snapshot.exists()) {
                onChange(null);
                return;
            }

            const valor = snapshot.val() as Record<string, any>;
            const idadeNumero = Number.parseInt(valor?.idade ?? "0", 10);
            const criadoEmNumero =
                typeof valor?.criadoEm === "number" ? valor.criadoEm : undefined;
            const comprovantePagamento = normalizarComprovanteValor(valor?.comprovantePagamento);
            const pagamento = normalizarPagamentoValor(valor?.pagamento);
            const statusPagamento = normalizarStatusPagamento(valor?.statusPagamento ?? pagamento?.status);

            onChange({
                id: inscricaoId,
                ...valor,
                idade: Number.isNaN(idadeNumero) ? 0 : idadeNumero,
                criadoEm: criadoEmNumero,
                statusPagamento,
                pagamento,
                comprovantePagamento,
            } as InscricaoRegistrada);
        },
        (firebaseError) => {
            const error =
                firebaseError instanceof Error
                    ? firebaseError
                    : new Error(String(firebaseError));
            console.error("[observarInscricao] erro ao ouvir inscrição:", error);
            onError?.(error);
        },
    );

    return () => unsubscribe();
};

export const atualizarInscricao = async (inscricao: InscricaoRegistrada): Promise<void> => {
    const {id, ...dados} = inscricao;
    const referencia = ref(firebaseDatabase, `${INSCRICOES_PATH}/${id}`);
    const payload: Record<string, unknown> = {
        ...dados,
        idade: Number.isFinite(Number(dados.idade)) ? Number(dados.idade) : 0,
    };
    await update(referencia, payload);
};

export const observarTotalInscricoes = (
    onChange: (total: number) => void,
    onError?: (error: Error) => void,
): (() => void) => {
    const referencia = ref(firebaseDatabase, INSCRICOES_PATH);
    const unsubscribe = onValue(
        referencia,
        (snapshot) => {
            if (!snapshot.exists()) {
                onChange(0);
                return;
            }
            const dados = snapshot.val() as Record<string, unknown>;
            onChange(Object.keys(dados).length);
        },
        (firebaseError) => {
            const error =
                firebaseError instanceof Error
                    ? firebaseError
                    : new Error(String(firebaseError));
            console.error("[observarTotalInscricoes] erro ao ouvir inscrições:", error);
            onError?.(error);
        },
    );
    return () => unsubscribe();
};

export const removerInscricoes = async (ids: string[]): Promise<void> => {
    if (ids.length === 0) {
        return;
    }
    await Promise.all(
        ids.map((id) => remove(ref(firebaseDatabase, `${INSCRICOES_PATH}/${id}`))),
    );
};
