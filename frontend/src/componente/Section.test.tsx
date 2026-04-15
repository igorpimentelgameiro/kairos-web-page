import {render, screen} from "@testing-library/react";
import Section from "./Section";

describe("Section", () => {
    test("deve renderizar titulo, subtitulo e conteúdo", () => {
        render(
            <Section title="Retiro Kairós" subtitle="Inscrições abertas">
                <span>Detalhes do retiro</span>
            </Section>,
        );

        expect(screen.getByRole("heading", {name: "Retiro Kairós"})).toBeInTheDocument();
        expect(screen.getByText("Inscrições abertas")).toBeInTheDocument();
        expect(screen.getByText("Detalhes do retiro")).toBeInTheDocument();
    });
});
