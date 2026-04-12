import {fetcher} from "@dominio/servicos/fetcher";
import type {InscricaoRequestDto, InscricaoResponseDto} from "@dominio/dto/inscricaoDto";

const INSCRICOES_ENDPOINT = "/inscricoes";

const toJson = (payload: InscricaoRequestDto): string =>
    JSON.stringify(payload, (_key, value) => (value === undefined ? undefined : value));

export const realizarInscricao = async (payload: InscricaoRequestDto): Promise<InscricaoResponseDto> =>
    fetcher<InscricaoResponseDto>(INSCRICOES_ENDPOINT, {
        method: "POST",
        body: toJson(payload),
    });
