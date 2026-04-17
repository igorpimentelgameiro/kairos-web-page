import {processarPagamentoCredito} from "./pagamentoApiServico";

describe("pagamentoApiServico", () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        globalThis.fetch = fetchMock as unknown as typeof fetch;
    });

    test("deve processar pagamento com sucesso", async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({
                status: "PROCESSANDO",
                mensagem: "Pagamento recebido.",
                inscricaoId: "insc-123",
            }),
        });

        const response = await processarPagamentoCredito({
            inscricaoId: "insc-123",
            valor: 150,
            tokenPagamento: "tok_demo_123",
        });

        expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/pagamentos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inscricaoId: "insc-123",
                valor: 150,
                tokenPagamento: "tok_demo_123",
            }),
        });
        expect(response).toEqual({
            status: "PROCESSANDO",
            mensagem: "Pagamento recebido.",
            inscricaoId: "insc-123",
        });
    });

    test("deve propagar detalhes de erro da api", async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Payment processing failed",
                details: ["Gateway recusado.", "Token inválido."],
            }),
        });

        await expect(
            processarPagamentoCredito({
                inscricaoId: "insc-erro",
                valor: 150,
                tokenPagamento: "fail_demo",
            }),
        ).rejects.toThrow("Gateway recusado. Token inválido.");
    });

    test("deve falhar quando a resposta da api for invalida", async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({mensagem: "sem status"}),
        });

        await expect(
            processarPagamentoCredito({
                inscricaoId: "insc-123",
                valor: 150,
                tokenPagamento: "tok_demo_123",
            }),
        ).rejects.toThrow("Resposta inválida da API de pagamentos.");
    });
});
