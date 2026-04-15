import {render, screen} from "@testing-library/react";
import Contato from "./Contato";

describe("Contato", () => {
    test("deve renderizar os contatos e formulário de mensagem", () => {
        render(<Contato />);

        expect(screen.getByText("Endereço & Contatos")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Seu nome")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Seu e-mail")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Escreva sua mensagem")).toBeInTheDocument();
    });
});
