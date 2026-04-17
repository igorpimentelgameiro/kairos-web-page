import type {InscricaoRequestDto} from "@dominio/dto/inscricaoDto";

const getMock = jest.fn();
const onValueMock = jest.fn();
const pushMock = jest.fn();
const refMock = jest.fn();
const removeMock = jest.fn();
const serverTimestampMock = jest.fn(() => "server-timestamp");
const updateMock = jest.fn();

jest.mock("@dominio/firebase/app", () => ({
    obterFirebaseDatabase: () => ({app: "firebase"}),
}));

jest.mock("firebase/database", () => ({
    get: (...args: unknown[]) => getMock(...args),
    onValue: (...args: unknown[]) => onValueMock(...args),
    push: (...args: unknown[]) => pushMock(...args),
    ref: (...args: unknown[]) => refMock(...args),
    remove: (...args: unknown[]) => removeMock(...args),
    serverTimestamp: () => serverTimestampMock(),
    update: (...args: unknown[]) => updateMock(...args),
}));

const criarPayload = (): InscricaoRequestDto => ({
    nomeCompleto: "Maria do Carmo",
    dataNascimento: "2000-01-01",
    idade: 26,
    documentoIdentificacao: "123456",
    contatoIndividual: "+5591988887777",
    endereco: "Rua A, 10",
    tamanhoCamisa: "M",
    contatoEmergencia: {
        nome: "José",
        parentesco: "Pai",
        contato: "91999998888",
    },
    participouDeRetiro: false,
    comunidadeOrigem: "Basílica",
    donsHabilidades: "Cantar",
    formaPagamento: "PIX",
    consentimentoImagem: true,
    consentimentoDados: true,
});

describe("inscricaoFirebaseServico", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        getMock.mockReset();
        onValueMock.mockReset();
        pushMock.mockReset();
        refMock.mockReset();
        removeMock.mockReset();
        serverTimestampMock.mockClear();
        updateMock.mockReset();
        refMock.mockImplementation((_database: unknown, path: string) => ({path}));
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("deve salvar inscricao com valores padrao normalizados", async () => {
        pushMock.mockResolvedValue({key: "insc-123"});

        const {salvarInscricao} = await import("./inscricaoFirebaseServico");
        const id = await salvarInscricao(criarPayload());

        expect(id).toBe("insc-123");
        expect(pushMock).toHaveBeenCalledWith(
            {path: "inscricoes"},
            expect.objectContaining({
                statusPagamento: "PENDENTE",
                pagamento: null,
                responsavelLegal: null,
                comprovantePagamento: null,
                observacoes: null,
                criadoEm: "server-timestamp",
            }),
        );
    });

    test("deve listar inscricoes normalizando campos dinamicos", async () => {
        getMock.mockResolvedValue({
            exists: () => true,
            val: () => ({
                "insc-1": {
                    ...criarPayload(),
                    idade: "18",
                    criadoEm: 123,
                    comprovantePagamento: "base64-file",
                    pagamento: {
                        valor: "150.5",
                        status: "PAGO",
                        detalhe: "Confirmado",
                        gateway: "simulado",
                        atualizadoEm: 999,
                    },
                },
            }),
        });

        const {listarInscricoes} = await import("./inscricaoFirebaseServico");
        const inscricoes = await listarInscricoes();

        expect(inscricoes).toEqual([
            expect.objectContaining({
                id: "insc-1",
                idade: 18,
                criadoEm: 123,
                statusPagamento: "PAGO",
                comprovantePagamento: expect.objectContaining({
                    nomeArquivo: "base64-file",
                    conteudoBase64: "base64-file",
                }),
                pagamento: expect.objectContaining({
                    valor: 150.5,
                    status: "PAGO",
                    detalhe: "Confirmado",
                }),
            }),
        ]);
    });

    test("deve observar inscricao e propagar alteracoes normalizadas", async () => {
        let callback: ((snapshot: {exists: () => boolean; val: () => unknown}) => void) | undefined;
        onValueMock.mockImplementation((_ref, onChange) => {
            callback = onChange;
            return jest.fn();
        });

        const {observarInscricao} = await import("./inscricaoFirebaseServico");
        const onChange = jest.fn();
        observarInscricao("insc-10", onChange);

        callback?.({
            exists: () => true,
            val: () => ({
                ...criarPayload(),
                idade: "20",
                pagamento: {
                    valor: 150,
                    status: "PROCESSANDO",
                    detalhe: "Em análise",
                    atualizadoEm: 50,
                },
            }),
        });

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "insc-10",
                idade: 20,
                statusPagamento: "PROCESSANDO",
                pagamento: expect.objectContaining({
                    detalhe: "Em análise",
                }),
            }),
        );
    });

    test("deve propagar erro ao observar inscricao", async () => {
        const firebaseError = new Error("firebase offline");
        onValueMock.mockImplementation((_ref, _onChange, onError) => {
            onError(firebaseError);
            return jest.fn();
        });

        const {observarInscricao} = await import("./inscricaoFirebaseServico");
        const onError = jest.fn();
        observarInscricao("insc-10", jest.fn(), onError);

        expect(onError).toHaveBeenCalledWith(firebaseError);
    });
});
