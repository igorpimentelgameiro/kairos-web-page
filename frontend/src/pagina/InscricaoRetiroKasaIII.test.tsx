import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import InscricaoRetiroKasaIII from "./InscricaoRetiroKasaIII";

const salvarInscricaoMock = jest.fn();
const observarInscricaoMock = jest.fn();
const processarPagamentoCreditoMock = jest.fn();

class FileReaderMock {
    result: string | null = null;
    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;

    readAsDataURL(file: Blob) {
        this.result = `data:${file.type};base64,ZmFrZS1iYXNlNjQ=`;
        this.onload?.();
    }
}

jest.mock("framer-motion", () => ({
    motion: {
        div: ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
        main: ({children, ...props}: React.HTMLAttributes<HTMLElement>) => <main {...props}>{children}</main>,
    },
    AnimatePresence: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

jest.mock("@dominio/servicos/inscricaoFirebaseServico", () => ({
    salvarInscricao: (...args: unknown[]) => salvarInscricaoMock(...args),
    observarInscricao: (...args: unknown[]) => observarInscricaoMock(...args),
}));

jest.mock("@dominio/servicos/pagamentoApiServico", () => ({
    processarPagamentoCredito: (...args: unknown[]) => processarPagamentoCreditoMock(...args),
}));

const preencherFormularioBase = () => {
    fireEvent.change(screen.getByLabelText("Nome completo"), {target: {value: "Maria do Carmo"}});
    fireEvent.change(screen.getByLabelText("RG ou CPF"), {target: {value: "123456789"}});
    fireEvent.change(screen.getByLabelText("Data de nascimento"), {target: {value: "2000-01-01"}});
    fireEvent.change(screen.getByLabelText("Idade"), {target: {value: "26"}});
    fireEvent.change(screen.getByLabelText("Contato individual (WhatsApp / celular)"), {
        target: {value: "(91) 98888-7777"},
    });
    fireEvent.change(screen.getByLabelText("Endereço completo"), {target: {value: "Rua A, 10"}});
    fireEvent.change(screen.getByRole("combobox"), {target: {value: "M"}});
    fireEvent.change(screen.getByPlaceholderText("Nome"), {target: {value: "José"}});
    fireEvent.change(screen.getByPlaceholderText("Parentesco"), {target: {value: "Pai"}});
    fireEvent.change(screen.getByPlaceholderText("Contato (WhatsApp/telefone)"), {
        target: {value: "91999998888"},
    });
    fireEvent.change(screen.getByLabelText("Paróquia, comunidade, grupo ou movimento de origem"), {
        target: {value: "Basílica"},
    });
    fireEvent.click(screen.getByLabelText("Declaro que li e concordo com o tratamento dos meus dados pessoais conforme a LGPD."));
    fireEvent.click(screen.getByLabelText("Autorizo o uso da minha imagem, voz e registros para divulgação do evento."));
};

describe("InscricaoRetiroKasaIII", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        salvarInscricaoMock.mockReset();
        observarInscricaoMock.mockReset();
        processarPagamentoCreditoMock.mockReset();
        observarInscricaoMock.mockReturnValue(jest.fn());
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        Object.assign(navigator, {
            clipboard: {writeText: jest.fn().mockResolvedValue(undefined)},
        });
        Object.defineProperty(window, "FileReader", {
            writable: true,
            value: FileReaderMock,
        });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("deve enviar inscricao com cartao e acompanhar pagamento confirmado", async () => {
        salvarInscricaoMock.mockResolvedValue("insc-123");
        observarInscricaoMock.mockImplementation((_id, onChange) => {
            onChange({
                id: "insc-123",
                statusPagamento: "PAGO",
                pagamento: {
                    status: "PAGO",
                    detalhe: "Pagamento confirmado",
                },
            });
            return jest.fn();
        });
        processarPagamentoCreditoMock.mockResolvedValue({
            status: "PROCESSANDO",
            mensagem: "Pagamento recebido.",
            inscricaoId: "insc-123",
        });

        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);
        preencherFormularioBase();
        fireEvent.click(screen.getByLabelText("Cartão de crédito"));
        fireEvent.change(screen.getByPlaceholderText("Nome impresso no cartão"), {target: {value: "Maria do Carmo"}});
        fireEvent.change(screen.getByPlaceholderText("Número do cartão"), {target: {value: "4111111111111111"}});
        fireEvent.change(screen.getByPlaceholderText("MM/AA"), {target: {value: "1228"}});
        fireEvent.change(screen.getByPlaceholderText("CVV"), {target: {value: "123"}});

        fireEvent.click(screen.getByRole("button", {name: "Enviar inscrição"}));

        await waitFor(() => expect(salvarInscricaoMock).toHaveBeenCalled());
        expect(salvarInscricaoMock).toHaveBeenCalledWith(
            expect.objectContaining({
                nomeCompleto: "Maria do Carmo",
                contatoIndividual: "+5591988887777",
                formaPagamento: "CREDITO",
            }),
        );
        await waitFor(() =>
            expect(processarPagamentoCreditoMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    inscricaoId: "insc-123",
                    valor: 150,
                }),
            ),
        );
        expect(observarInscricaoMock).toHaveBeenCalledWith("insc-123", expect.any(Function), expect.any(Function));
        expect(await screen.findByText(/Pagamento confirmado, Maria!/)).toBeInTheDocument();
        expect(screen.getByText(/Detalhe do pagamento: Pagamento confirmado/)).toBeInTheDocument();
    });

    test("deve exibir erro quando nao conseguir acompanhar o pagamento em tempo real", async () => {
        salvarInscricaoMock.mockResolvedValue("insc-456");
        observarInscricaoMock.mockImplementation((_id, _onChange, onError) => {
            onError(new Error("firebase offline"));
            return jest.fn();
        });
        processarPagamentoCreditoMock.mockResolvedValue({
            status: "PROCESSANDO",
            mensagem: "Pagamento recebido.",
            inscricaoId: "insc-456",
        });

        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);
        preencherFormularioBase();
        fireEvent.click(screen.getByLabelText("Cartão de crédito"));
        fireEvent.change(screen.getByPlaceholderText("Nome impresso no cartão"), {target: {value: "Maria do Carmo"}});
        fireEvent.change(screen.getByPlaceholderText("Número do cartão"), {target: {value: "4111111111111111"}});
        fireEvent.change(screen.getByPlaceholderText("MM/AA"), {target: {value: "1228"}});
        fireEvent.change(screen.getByPlaceholderText("CVV"), {target: {value: "123"}});

        fireEvent.click(screen.getByRole("button", {name: "Enviar inscrição"}));

        expect(
            await screen.findByText("Não foi possível acompanhar o status do pagamento em tempo real."),
        ).toBeInTheDocument();
    });

    test("deve aceitar inscrição via pix com comprovante", async () => {
        salvarInscricaoMock.mockResolvedValue("insc-pix");

        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);
        preencherFormularioBase();
        fireEvent.click(screen.getByLabelText("PIX"));

        const arquivo = new File(["conteudo"], "comprovante.png", {type: "image/png"});
        fireEvent.change(screen.getByLabelText("Comprovante de pagamento"), {
            target: {files: [arquivo]},
        });
        fireEvent.click(screen.getByRole("button", {name: "Enviar inscrição"}));

        await waitFor(() => expect(salvarInscricaoMock).toHaveBeenCalled());
        expect(processarPagamentoCreditoMock).not.toHaveBeenCalled();
        expect(await screen.findByText(/Obrigado, Maria!/)).toBeInTheDocument();
    });

    test("deve validar comprovante grande", async () => {
        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);

        const arquivoGrande = new File(["x"], "grande.pdf", {type: "application/pdf"});
        Object.defineProperty(arquivoGrande, "size", {value: 5 * 1024 * 1024});
        fireEvent.change(screen.getByLabelText("Comprovante de pagamento"), {
            target: {files: [arquivoGrande]},
        });
        expect(await screen.findByText("Comprovante muito grande. Envie arquivo de até 4MB.")).toBeInTheDocument();
    });

    test("deve validar formato inválido de comprovante", async () => {
        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);

        const arquivoInvalido = new File(["x"], "arquivo.txt", {type: "text/plain"});
        fireEvent.change(screen.getByLabelText("Comprovante de pagamento"), {
            target: {files: [arquivoInvalido]},
        });
        expect(await screen.findByText("Formato inválido. Use JPG, PNG, PDF ou HEIC.")).toBeInTheDocument();
    });

    test("deve exigir cartão válido quando forma de pagamento for crédito", async () => {
        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);
        preencherFormularioBase();
        fireEvent.click(screen.getByLabelText("Cartão de crédito"));
        fireEvent.change(screen.getByPlaceholderText("Nome impresso no cartão"), {target: {value: "Maria"}});
        fireEvent.change(screen.getByPlaceholderText("Número do cartão"), {target: {value: "1234"}});
        fireEvent.change(screen.getByPlaceholderText("MM/AA"), {target: {value: "0120"}});
        fireEvent.change(screen.getByPlaceholderText("CVV"), {target: {value: "1"}});

        fireEvent.submit(screen.getByRole("button", {name: "Enviar inscrição"}).closest("form")!);

        expect(await screen.findByText("Preencha corretamente os dados simulados do cartão.")).toBeInTheDocument();
    });

    test("deve exibir erro ao falhar ao salvar inscrição", async () => {
        salvarInscricaoMock.mockRejectedValueOnce(new Error("firebase indisponível"));

        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);
        preencherFormularioBase();
        fireEvent.click(screen.getByLabelText("Dinheiro"));
        fireEvent.click(screen.getByRole("button", {name: "Enviar inscrição"}));

        expect(
            await screen.findByText("Não foi possível enviar sua inscrição: firebase indisponível"),
        ).toBeInTheDocument();
    });

    test("deve copiar a chave pix", async () => {
        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", {name: /Copiar chave Pix/i}));

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("movimentokairos23@gmail.com"),
        );
        expect(await screen.findByText("Chave copiada!")).toBeInTheDocument();
    });

    test("deve abrir campos de responsável e outros dons", async () => {
        render(<InscricaoRetiroKasaIII onVoltar={jest.fn()} />);

        fireEvent.click(screen.getAllByLabelText("Sim")[0]);
        fireEvent.click(screen.getByLabelText("Outros talentos (descrever)"));

        expect(screen.getByLabelText("Nome do responsável legal")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Descreva outros talentos")).toBeInTheDocument();
    });
});
