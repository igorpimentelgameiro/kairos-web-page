type ProcessarPagamentoCreditoRequest = {
    inscricaoId: string;
    valor: number;
    tokenPagamento: string;
};

type ProcessarPagamentoCreditoResponse = {
    status: string;
    mensagem: string;
    inscricaoId: string;
};

const resolveApiBaseUrl = (): string => {
    try {
        const viteEnvValue = Function(
            "try { return import.meta.env?.VITE_PAGAMENTOS_API_URL; } catch (_error) { return undefined; }",
        )() as string | undefined;
        return viteEnvValue?.trim() || "http://localhost:8080";
    } catch (_error) {
        return "http://localhost:8080";
    }
};

const API_BASE_URL = resolveApiBaseUrl();

export const processarPagamentoCredito = async (
    payload: ProcessarPagamentoCreditoRequest,
): Promise<ProcessarPagamentoCreditoResponse> => {
    const response = await fetch(`${API_BASE_URL}/pagamentos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const responseBody = (await response.json().catch(() => null)) as
        | ProcessarPagamentoCreditoResponse
        | {details?: string[]; error?: string}
        | null;

    if (!response.ok) {
        const details =
            responseBody && "details" in responseBody && Array.isArray(responseBody.details)
                ? responseBody.details.join(" ")
                : responseBody && "error" in responseBody && responseBody.error
                  ? responseBody.error
                  : "Falha ao iniciar o pagamento.";
        throw new Error(details);
    }

    if (!responseBody || !("status" in responseBody)) {
        throw new Error("Resposta inválida da API de pagamentos.");
    }

    return responseBody;
};
