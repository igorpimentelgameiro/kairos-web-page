import {fireEvent, render, screen} from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
    test("deve navegar ao clicar em um item", () => {
        const onNavigate = jest.fn();

        render(<Navbar current="HOME" onNavigate={onNavigate} />);

        fireEvent.click(screen.getAllByRole("button", {name: "Contato"})[0]);

        expect(onNavigate).toHaveBeenCalledWith("CONTATO");
    });

    test("deve exibir fallback quando a logo falhar", () => {
        render(<Navbar current="HOME" onNavigate={jest.fn()} />);

        fireEvent.error(screen.getByAltText("Movimento Kairós"));

        expect(screen.queryByAltText("Movimento Kairós")).not.toBeInTheDocument();
        expect(screen.getByText("Viver o Tempo da Graça")).toBeInTheDocument();
    });
});
