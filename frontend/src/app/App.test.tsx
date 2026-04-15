import {fireEvent, render, screen} from "@testing-library/react";
import App from "./App";

jest.mock("framer-motion", () => ({
    motion: {
        div: ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
        main: ({children, ...props}: React.HTMLAttributes<HTMLElement>) => <main {...props}>{children}</main>,
    },
    AnimatePresence: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

jest.mock("@pagina/Home", () => ({
    __esModule: true,
    default: ({onCTA, goBenfeitor}: {onCTA: () => void; goBenfeitor: () => void}) => (
        <div>
            <button onClick={onCTA}>Home CTA</button>
            <button onClick={goBenfeitor}>Home Benfeitor</button>
        </div>
    ),
}));
jest.mock("@pagina/QuemSomos", () => ({__esModule: true, default: () => <div>Quem somos mock</div>}));
jest.mock("@pagina/Kasa", () => ({
    __esModule: true,
    default: ({onParticipar}: {onParticipar: () => void}) => (
        <button onClick={onParticipar}>Participar Kasa</button>
    ),
}));
jest.mock("@pagina/Benfeitor", () => ({__esModule: true, default: () => <div>Benfeitor mock</div>}));
jest.mock("@pagina/Contato", () => ({__esModule: true, default: () => <div>Contato mock</div>}));
jest.mock("@pagina/AdminLogin", () => ({__esModule: true, default: () => <div>Admin login mock</div>}));
jest.mock("@pagina/InscricaoRetiroKasaIII", () => ({
    __esModule: true,
    default: ({onVoltar}: {onVoltar: () => void}) => (
        <button onClick={onVoltar}>Voltar inscrição</button>
    ),
}));

describe("App", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("deve renderizar rota principal e navegar entre páginas", async () => {
        window.history.pushState({}, "", "/");
        render(<App />);

        fireEvent.click(screen.getByText("Home CTA"));
        expect(await screen.findByText("Participar Kasa")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Participar Kasa"));
        expect(await screen.findByText("Voltar inscrição")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Voltar inscrição"));
        expect(screen.getByText("Participar Kasa")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: /Apoiar/i}));
        expect(screen.getByText("Benfeitor mock")).toBeInTheDocument();
    });

    test("deve renderizar área administrativa na rota /admin", async () => {
        window.history.pushState({}, "", "/admin");
        render(<App />);

        expect(await screen.findByText("Admin login mock")).toBeInTheDocument();
    });
});
