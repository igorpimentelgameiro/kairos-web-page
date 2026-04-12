import {Palette} from "lucide-react";
import type {ThemeName, ThemeOption} from "@componente/theme/themes";

type ThemeSwitcherProps = {
    temaAtual: ThemeOption;
    temas: ThemeOption[];
    onChange: (nome: ThemeName) => void;
    className?: string;
    label?: string;
};

export default function ThemeSwitcher({
    temaAtual,
    temas,
    onChange,
    className = "",
    label = "Tema",
}: ThemeSwitcherProps) {
    return (
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
            <Palette className="size-4" aria-hidden/>
            <span className="font-semibold uppercase tracking-wide">{label}</span>
            <select
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                value={temaAtual.nome}
                onChange={(event) => onChange(event.target.value as ThemeName)}
            >
                {temas.map((tema) => (
                    <option key={tema.nome} value={tema.nome}>
                        {tema.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}
