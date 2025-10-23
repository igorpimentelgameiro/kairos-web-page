import {get, push, ref, serverTimestamp, update} from "firebase/database";
import {firebaseDatabase} from "@dominio/firebase/app";
import type {InscricaoRequestDto} from "@dominio/dto/inscricaoDto";

const INSCRICOES_PATH = "inscricoes";

type NormalizedInscricao = InscricaoRequestDto & {
    criadoEm: ReturnType<typeof serverTimestamp>;
};

const normalizarPayload = (payload: InscricaoRequestDto): NormalizedInscricao => ({
    ...payload,
    responsavelLegal: payload.responsavelLegal ?? null,
    alergiasIntolerancias: payload.alergiasIntolerancias ?? null,
    necessidadesEspeciais: payload.necessidadesEspeciais ?? null,
    comprovantePagamento: payload.comprovantePagamento ?? null,
    observacoes: payload.observacoes ?? null,
    criadoEm: serverTimestamp(),
});

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
        return {
            id,
            ...valor,
            idade: Number.isNaN(idadeNumero) ? 0 : idadeNumero,
            criadoEm: criadoEmNumero,
        } as InscricaoRegistrada;
    });
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
