import {useMemo, useState} from "react";
import {realizarInscricao} from "@dominio/servicos/inscricaoServico";
import type {InscricaoRequestDto} from "@dominio/dto/inscricaoDto";
import {ApiError} from "@dominio/servicos/fetcher";

const buildPayload = (): InscricaoRequestDto => {
    const nascimento = new Date(2000, 0, 1).toISOString().slice(0, 10);
    return {
        nomeCompleto: "Participante Teste Movimento Kairós",
        dataNascimento: nascimento,
        idade: 25,
        responsavelLegal: null,
        documentoIdentificacao: `TEST-${Date.now()}`,
        contatoIndividual: "(91) 99999-9999",
        endereco: "Rua da Esperança, 123 - Belém/PA",
        tamanhoCamisa: "M",
        contatoEmergencia: {
            nome: "Contato Kairós",
            parentesco: "Coordenação",
            contato: "(91) 98888-8888",
        },
        alergiasIntolerancias: null,
        necessidadesEspeciais: null,
        participouDeRetiro: false,
        comunidadeOrigem: "Movimento Kairós",
        donsHabilidades: "Serviço, música",
        formaPagamento: "PIX",
        comprovantePagamento: null,
        consentimentoImagem: true,
        consentimentoDados: true,
    };
};

export default function TestInscricaoButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [mensagem, setMensagem] = useState<string | null>(null);

    const texto = useMemo(() => {
        switch (status) {
            case "loading":
                return "Enviando inscrição de teste...";
            case "success":
                return mensagem ?? "Inscrição criada com sucesso";
            case "error":
                return mensagem ?? "Erro ao enviar inscrição";
            default:
                return "Testar API de inscrição";
        }
    }, [status, mensagem]);

    const handleClick = async () => {
        setStatus("loading");
        setMensagem(null);
        try {
            const response = await realizarInscricao(buildPayload());
            setStatus("success");
            setMensagem(`ID gerado: ${response.inscricaoId}`);
        } catch (error) {
            const message =
                error instanceof ApiError ? `${error.status} - ${error.message}` : (error as Error).message;
            setStatus("error");
            setMensagem(message ?? "Falha ao conectar com o backend");
        }
    };

    return (
        <div className="fixed bottom-4 left-4 flex flex-col gap-2">
            <button
                type="button"
                onClick={handleClick}
                disabled={status === "loading"}
                className="px-4 py-2 rounded-full border bg-background/80 backdrop-blur text-sm font-semibold shadow transition hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
            >
                {texto}
            </button>
            {status === "error" && mensagem ? (
                <span className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-2 py-1">{mensagem}</span>
            ) : null}
        </div>
    );
}
