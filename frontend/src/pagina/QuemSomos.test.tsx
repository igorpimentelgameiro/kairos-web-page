import {render, screen} from "@testing-library/react";
import QuemSomos from "./QuemSomos";

describe("QuemSomos", () => {
    test("deve renderizar carisma, missão, comunidade e história", () => {
        render(<QuemSomos />);

        expect(screen.getByText("Carisma")).toBeInTheDocument();
        expect(screen.getByText("Missão")).toBeInTheDocument();
        expect(screen.getByText("Comunidade")).toBeInTheDocument();
        expect(screen.getByText("Fundação do Movimento Kairós.")).toBeInTheDocument();
    });
});
