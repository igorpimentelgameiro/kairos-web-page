export const PAGE_LABELS = {
    HOME: "Início",
    QUEM_SOMOS: "Quem Somos",
    KASA: "Retiro KASA",
    BENFEITOR: "Seja Benfeitor",
    CONTATO: "Contato",
    INSCRICAO_KASA_III: "Inscrição Retiro Kasa III",
} as const;

export type PageKey = keyof typeof PAGE_LABELS;

export const NAVIGATION_PAGES: PageKey[] = ["HOME", "QUEM_SOMOS", "KASA", "BENFEITOR", "CONTATO"];
