import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {FirebaseError} from "firebase/app";
import AdminLogin from "./AdminLogin";

const entrarComCredenciaisMock = jest.fn();
const observarEstadoAutenticacaoMock = jest.fn();

jest.mock("@pagina/AdminDashboard", () => ({
    __esModule: true,
    default: () => <div>Painel mockado</div>,
}));

jest.mock("@dominio/servicos/authServico", () => ({
    entrarComCredenciais: (...args: unknown[]) => entrarComCredenciaisMock(...args),
    observarEstadoAutenticacao: (...args: unknown[]) => observarEstadoAutenticacaoMock(...args),
}));

describe("AdminLogin", () => {
    beforeEach(() => {
        entrarComCredenciaisMock.mockReset();
        observarEstadoAutenticacaoMock.mockReset();
        jest.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("deve renderizar o painel quando o usuário já estiver autenticado", async () => {
        observarEstadoAutenticacaoMock.mockImplementation((callback) => {
            callback({uid: "1"});
            return jest.fn();
        });

        render(<AdminLogin />);

        expect(await screen.findByText("Painel mockado")).toBeInTheDocument();
    });

    test("deve autenticar com credenciais válidas", async () => {
        observarEstadoAutenticacaoMock.mockImplementation((callback) => {
            callback(null);
            return jest.fn();
        });
        entrarComCredenciaisMock.mockResolvedValue({user: {uid: "1"}});

        render(<AdminLogin />);

        fireEvent.change(screen.getByLabelText("Login"), {target: {value: "admin@kairos.com"}});
        fireEvent.change(screen.getByLabelText("Senha"), {target: {value: "123456"}});
        fireEvent.click(screen.getByRole("button", {name: "Entrar"}));

        await waitFor(() =>
            expect(entrarComCredenciaisMock).toHaveBeenCalledWith("admin@kairos.com", "123456"),
        );
        expect(await screen.findByText("Painel mockado")).toBeInTheDocument();
    });

    test("deve exibir mensagem de credenciais inválidas", async () => {
        observarEstadoAutenticacaoMock.mockImplementation((callback) => {
            callback(null);
            return jest.fn();
        });
        entrarComCredenciaisMock.mockRejectedValue(
            new FirebaseError("auth/invalid-login-credentials", "Credenciais inválidas"),
        );
        render(<AdminLogin />);

        fireEvent.change(screen.getByLabelText("Login"), {target: {value: "admin"}});
        fireEvent.change(screen.getByLabelText("Senha"), {target: {value: "senha"}});
        fireEvent.click(screen.getByRole("button", {name: "Entrar"}));

        expect(await screen.findByText("Credenciais incorretas. Verifique seu login e senha.")).toBeInTheDocument();
    });
});
