import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";

const atualizarInscricaoMock = jest.fn();
const listarInscricoesMock = jest.fn();
const removerInscricoesMock = jest.fn();
const sairMock = jest.fn();
const createObjectUrlMock = jest.fn(() => "blob:test");
const revokeObjectUrlMock = jest.fn();

jest.mock("@dominio/servicos/inscricaoFirebaseServico", () => ({
    atualizarInscricao: (...args: unknown[]) => atualizarInscricaoMock(...args),
    listarInscricoes: (...args: unknown[]) => listarInscricoesMock(...args),
    removerInscricoes: (...args: unknown[]) => removerInscricoesMock(...args),
}));

jest.mock("@dominio/servicos/authServico", () => ({
    sair: (...args: unknown[]) => sairMock(...args),
}));

const inscricao = {
    id: "insc-1",
    nomeCompleto: "Maria do Carmo",
    dataNascimento: "2000-01-01",
    idade: 25,
    responsavelLegal: null,
    documentoIdentificacao: "123456",
    contatoIndividual: "+5591988887777",
    endereco: "Rua A, 10",
    tamanhoCamisa: "M",
    contatoEmergencia: {
        nome: "José",
        parentesco: "Pai",
        contato: "91999998888",
    },
    alergiasIntolerancias: null,
    necessidadesEspeciais: null,
    participouDeRetiro: false,
    comunidadeOrigem: "Basílica",
    donsHabilidades: "Cantar",
    formaPagamento: "PIX",
    comprovantePagamento: null,
    consentimentoImagem: true,
    consentimentoDados: true,
    observacoes: null,
    criadoEm: 1715000000000,
};

const inscricaoMenor = {
    ...inscricao,
    id: "insc-2",
    nomeCompleto: "João Menor",
    idade: 16,
    formaPagamento: "CREDITO",
    comprovantePagamento: {
        nomeArquivo: "comprovante.pdf",
        url: "https://firebasestorage.googleapis.com/v0/b/kairos/o/comprovantes%2Farquivo.pdf?alt=media&name=comprovantes%2Farquivo.pdf",
        mimeType: "application/pdf",
        enviadoEm: "2026-04-15T10:00:00.000Z",
    },
};

describe("AdminDashboard", () => {
    beforeEach(() => {
        atualizarInscricaoMock.mockReset();
        listarInscricoesMock.mockReset();
        removerInscricoesMock.mockReset();
        sairMock.mockReset();
        listarInscricoesMock.mockResolvedValue([inscricao, inscricaoMenor]);
        Object.defineProperty(window, "confirm", {
            writable: true,
            value: jest.fn(() => true),
        });
        Object.defineProperty(window, "location", {
            writable: true,
            value: {href: "http://localhost/"},
        });
        URL.createObjectURL = createObjectUrlMock;
        URL.revokeObjectURL = revokeObjectUrlMock;
        jest.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("deve carregar inscrições e permitir logout", async () => {
        sairMock.mockResolvedValue(undefined);

        render(<AdminDashboard />);

        expect(await screen.findByText("Maria do Carmo")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Encerrar sessão"}));

        await waitFor(() => expect(sairMock).toHaveBeenCalled());
    });

    test("deve exibir erro ao carregar inscrições", async () => {
        listarInscricoesMock.mockRejectedValueOnce(new Error("erro"));

        render(<AdminDashboard />);

        expect(await screen.findByText("Não foi possível carregar as inscrições. Tente novamente.")).toBeInTheDocument();
    });

    test("deve exibir erro ao falhar no logout e navegar para home", async () => {
        sairMock.mockRejectedValueOnce(new Error("logout"));

        render(<AdminDashboard />);

        fireEvent.click(await screen.findByRole("button", {name: "Ir para o site"}));
        expect(window.location.href).toBe("/");

        fireEvent.click(screen.getByRole("button", {name: "Encerrar sessão"}));
        expect(await screen.findByText("Não foi possível encerrar a sessão. Tente novamente.")).toBeInTheDocument();
    });

    test("deve abrir modal de edição e salvar alterações", async () => {
        atualizarInscricaoMock.mockResolvedValue(undefined);

        render(<AdminDashboard />);

        fireEvent.click((await screen.findAllByRole("button", {name: "Editar"}))[0]);
        const nomeInputs = await screen.findAllByDisplayValue("Maria do Carmo");
        fireEvent.change(nomeInputs[nomeInputs.length - 1], {target: {value: "Maria Atualizada"}});
        fireEvent.click(screen.getByRole("button", {name: "Salvar alterações"}));

        await waitFor(() =>
            expect(atualizarInscricaoMock).toHaveBeenCalledWith(
                expect.objectContaining({nomeCompleto: "Maria Atualizada"}),
            ),
        );
    });

    test("deve exibir erro ao falhar ao salvar edição e permitir fechar modal", async () => {
        atualizarInscricaoMock.mockRejectedValueOnce(new Error("falha salvar"));

        render(<AdminDashboard />);

        fireEvent.click((await screen.findAllByRole("button", {name: "Editar"}))[0]);
        fireEvent.click(screen.getByRole("button", {name: "Salvar alterações"}));

        expect(await screen.findByText("Não foi possível salvar as alterações. Tente novamente.")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Fechar"}));
        expect(screen.queryByText(/Ajuste as informações necessárias/)).not.toBeInTheDocument();
    });

    test("deve filtrar, ordenar, selecionar, excluir e exportar inscrições", async () => {
        removerInscricoesMock.mockResolvedValue(undefined);
        const clickMock = jest.fn();
        const appendSpy = jest.spyOn(document.body, "appendChild");
        const removeSpy = jest.spyOn(document.body, "removeChild");
        const originalCreateElement = document.createElement.bind(document);
        const createElementSpy = jest.spyOn(document, "createElement").mockImplementation((tagName: string) => {
            if (tagName === "a") {
                const anchor = originalCreateElement("a");
                anchor.click = clickMock;
                return anchor;
            }
            return originalCreateElement(tagName);
        });

        render(<AdminDashboard />);

        expect(await screen.findByText("João Menor")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "18 anos ou mais"}));
        expect(screen.queryByText("Maria do Carmo")).not.toBeInTheDocument();
        expect(screen.getByText("João Menor")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: /Ordenar Nome completo ascendente/}));
        fireEvent.click(screen.getByLabelText("Selecionar todas as inscrições listadas"));
        fireEvent.click(screen.getByRole("button", {name: "Excluir selecionadas"}));

        await waitFor(() => expect(removerInscricoesMock).toHaveBeenCalledWith(["insc-2"]));

        fireEvent.click(screen.getByRole("button", {name: "18 anos ou mais"}));
        fireEvent.click(screen.getByRole("button", {name: /Exportar planilha/}));

        expect(createObjectUrlMock).toHaveBeenCalled();
        expect(clickMock).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
        createElementSpy.mockRestore();
    });

    test("deve exibir mensagens de erro ao excluir e exportar quando apropriado", async () => {
        removerInscricoesMock.mockRejectedValueOnce(new Error("falha excluir"));

        render(<AdminDashboard />);

        fireEvent.click(await screen.findByLabelText("Selecionar inscrição Maria do Carmo"));
        fireEvent.click(screen.getByRole("button", {name: "Excluir selecionadas"}));
        expect(await screen.findByText("Não foi possível excluir as inscrições selecionadas. Tente novamente.")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: "Menores de 18 anos"}));
        fireEvent.click(screen.getByRole("button", {name: "18 anos ou mais"}));
        fireEvent.click(screen.getByRole("button", {name: /Exportar planilha/}));
        expect(await screen.findByText("Não há inscrições para exportar.")).toBeInTheDocument();
    });

    test("deve mostrar comprovante e permitir remover no modal", async () => {
        render(<AdminDashboard />);

        fireEvent.click((await screen.findAllByRole("button", {name: "Editar"}))[1]);

        expect(await screen.findByText("Abrir comprovante atual")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Remover comprovante"}));
        expect(screen.getByText("Nenhum comprovante enviado.")).toBeInTheDocument();
        expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:test");
    });
});
