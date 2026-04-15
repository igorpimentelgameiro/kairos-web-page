import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import Benfeitor from "./Benfeitor";

describe("Benfeitor", () => {
    test("deve copiar a chave pix com sucesso", async () => {
        const writeText = jest.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {writeText},
        });

        render(<Benfeitor />);

        fireEvent.click(screen.getByRole("button", {name: /Copiar chave Pix/i}));

        await waitFor(() => expect(writeText).toHaveBeenCalledWith("movimentokairos23@gmail.com"));
        expect(await screen.findByText("Chave copiada!")).toBeInTheDocument();
    });
});
