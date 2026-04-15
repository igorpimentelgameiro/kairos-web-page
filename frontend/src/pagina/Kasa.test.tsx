import {render, screen} from "@testing-library/react";
import Kasa from "./Kasa";

describe("Kasa", () => {
    test("deve renderizar as edições e manter botões desabilitados", () => {
        render(<Kasa onParticipar={jest.fn()} />);

        expect(screen.getByText("Kasa III")).toBeInTheDocument();
        expect(screen.getByText("Kasa IV")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Encerrado"})).toBeDisabled();
        expect(screen.getByRole("button", {name: "Em Breve"})).toBeDisabled();
    });
});
