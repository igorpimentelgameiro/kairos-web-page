import {FirebaseError} from "firebase/app";

const onAuthStateChangedMock = jest.fn();
const signInWithEmailAndPasswordMock = jest.fn();
const signOutMock = jest.fn();

jest.mock("@dominio/firebase/app", () => ({
    obterFirebaseAuth: () => ({kind: "auth"}),
}));

jest.mock("firebase/auth", () => ({
    onAuthStateChanged: (...args: unknown[]) => onAuthStateChangedMock(...args),
    signInWithEmailAndPassword: (...args: unknown[]) => signInWithEmailAndPasswordMock(...args),
    signOut: (...args: unknown[]) => signOutMock(...args),
}));

describe("authServico", () => {
    beforeEach(() => {
        onAuthStateChangedMock.mockReset();
        signInWithEmailAndPasswordMock.mockReset();
        signOutMock.mockReset();
    });

    test("deve autenticar com credenciais válidas", async () => {
        signInWithEmailAndPasswordMock.mockResolvedValue({user: {uid: "1"}});

        const {entrarComCredenciais} = await import("./authServico");
        const resultado = await entrarComCredenciais("admin@kairos.com", "123456");

        expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(
            {kind: "auth"},
            "admin@kairos.com",
            "123456",
        );
        expect(resultado).toEqual({user: {uid: "1"}});
    });

    test("deve rejeitar credenciais vazias", async () => {
        const {entrarComCredenciais} = await import("./authServico");

        await expect(entrarComCredenciais("", "")).rejects.toBeInstanceOf(FirebaseError);
    });

    test("deve encerrar a sessão", async () => {
        signOutMock.mockResolvedValue(undefined);

        const {sair} = await import("./authServico");
        await sair();

        expect(signOutMock).toHaveBeenCalledWith({kind: "auth"});
    });

    test("deve observar estado de autenticação", async () => {
        const unsubscribe = jest.fn();
        onAuthStateChangedMock.mockReturnValue(unsubscribe);
        const callback = jest.fn();

        const {observarEstadoAutenticacao} = await import("./authServico");
        const retorno = observarEstadoAutenticacao(callback);

        expect(onAuthStateChangedMock).toHaveBeenCalledWith({kind: "auth"}, callback);
        expect(retorno).toBe(unsubscribe);
    });
});
