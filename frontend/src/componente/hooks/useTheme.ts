import {useCallback, useEffect, useMemo, useState} from "react";
import {THEMES, type ThemeName, themeOptions, type ThemeOption} from "@componente/theme/themes";

const STORAGE_KEY = "kairos-prefered-theme";
const DEFAULT_THEME: ThemeName = "Slate + Indigo";

const resolveInitialTheme = (): ThemeName => {
    if (typeof window === "undefined") {
        return DEFAULT_THEME;
    }
    const fromStorage = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (fromStorage && THEMES[fromStorage]) {
        return fromStorage;
    }
    return DEFAULT_THEME;
};

const applyThemeToDocument = (themeName: ThemeName) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", themeName);
    const tokens = THEMES[themeName];
    document.documentElement.style.setProperty("--background", tokens.bg);
    document.documentElement.style.setProperty("--foreground", tokens.fg);
    document.documentElement.style.setProperty("--muted", tokens.muted);
    document.documentElement.style.setProperty("--border", tokens.border);
    document.documentElement.style.setProperty("--surface", tokens.surface);
    document.documentElement.style.setProperty("--primary", tokens.primary);
    document.documentElement.style.setProperty("--primary-foreground", tokens.primaryFg);
    document.documentElement.style.setProperty("--accent", tokens.accent);
    document.documentElement.style.setProperty("--accent-foreground", tokens.accentFg);
};

export default function useTheme() {
    const [themeName, setThemeName] = useState<ThemeName>(() => resolveInitialTheme());

    useEffect(() => {
        applyThemeToDocument(themeName);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, themeName);
        }
    }, [themeName]);

    useEffect(() => {
        applyThemeToDocument(themeName);
    }, []);

    const definirTema = useCallback((nome: ThemeName) => {
        if (THEMES[nome]) {
            setThemeName(nome);
        }
    }, []);

    const alternarProximoTema = useCallback(() => {
        const nomes = Object.keys(THEMES) as ThemeName[];
        const indiceAtual = nomes.indexOf(themeName);
        const proximoIndice = (indiceAtual + 1) % nomes.length;
        setThemeName(nomes[proximoIndice]);
    }, [themeName]);

    const temaAtual: ThemeOption = useMemo(
        () => ({
            nome: themeName,
            tokens: THEMES[themeName],
        }),
        [themeName],
    );

    return {
        temaAtual,
        definirTema,
        alternarProximoTema,
        temasDisponiveis: themeOptions,
    };
}
