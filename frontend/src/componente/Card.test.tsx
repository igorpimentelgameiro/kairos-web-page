import {render, screen} from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
    test("deve renderizar o conteúdo interno", () => {
        render(<Card>Conteúdo Kairós</Card>);

        expect(screen.getByText("Conteúdo Kairós")).toBeInTheDocument();
    });
});
