export const THEMES = {
    "Slate + Indigo": {
        bg: "#0F172A",
        surface: "#111827",
        fg: "#E5E7EB",
        muted: "#9CA3AF",
        border: "#1F2937",
        primary: "#6366F1",
        primaryFg: "#ffffff",
        accent: "#1F2937",
        accentFg: "#E5E7EB",
    },
    "Slate + Emerald": {
        bg: "#0F172A",
        surface: "#111827",
        fg: "#E5E7EB",
        muted: "#9CA3AF",
        border: "#1F2937",
        primary: "#10B981",
        primaryFg: "#06281c",
        accent: "#1F2937",
        accentFg: "#E5E7EB",
    },
    "Navy + Gold": {
        bg: "#0B132B",
        surface: "#0F1C3F",
        fg: "#F3F4F6",
        muted: "#9AA4B2",
        border: "#1E2A4A",
        primary: "#F4B400",
        primaryFg: "#1A1400",
        accent: "#1E2A4A",
        accentFg: "#F3F4F6",
    },
    "Carbono + Roxo": {
        bg: "#0B0F19",
        surface: "#121826",
        fg: "#E5E7EB",
        muted: "#9CA3AF",
        border: "#1F2937",
        primary: "#7C3AED",
        primaryFg: "#F9FAFB",
        accent: "#1F2937",
        accentFg: "#E5E7EB",
    },
    "Slate + Terracotta": {
        bg: "#0F172A",
        surface: "#111827",
        fg: "#E5E7EB",
        muted: "#9CA3AF",
        border: "#1F2937",
        primary: "#E07A5F",
        primaryFg: "#2B0B07",
        accent: "#1F2937",
        accentFg: "#E5E7EB",
    },
} as const;

export type ThemeName = keyof typeof THEMES;

export type ThemeTokens = (typeof THEMES)[ThemeName];

export type ThemeOption = {
    nome: ThemeName;
    tokens: ThemeTokens;
};

export const themeOptions: ThemeOption[] = Object.entries(THEMES).map(([nome, tokens]) => ({
    nome: nome as ThemeName,
    tokens,
}));
