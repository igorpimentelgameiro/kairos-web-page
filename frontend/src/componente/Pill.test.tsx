import {render, screen} from "@testing-library/react";
import Pill from "./Pill";

describe("Pill", () => {
    test("deve renderizar o conteúdo recebido", () => {
        render(<Pill>Comunidade</Pill>);

        expect(screen.getByText("Comunidade")).toBeInTheDocument();
    });
});
