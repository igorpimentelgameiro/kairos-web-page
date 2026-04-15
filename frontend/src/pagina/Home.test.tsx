import {fireEvent, render, screen} from "@testing-library/react";
import Home from "./Home";

describe("Home", () => {
    test("deve renderizar chamadas principais e disparar ações", () => {
        const onCTA = jest.fn();
        const goBenfeitor = jest.fn();

        render(<Home onCTA={onCTA} goBenfeitor={goBenfeitor} />);

        expect(screen.getByText(/Kairós — o tempo de Deus/)).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: /Participar do KASA/i}));
        fireEvent.click(screen.getByRole("button", {name: /Seja um Benfeitor/i}));

        expect(onCTA).toHaveBeenCalled();
        expect(goBenfeitor).toHaveBeenCalled();
    });
});
