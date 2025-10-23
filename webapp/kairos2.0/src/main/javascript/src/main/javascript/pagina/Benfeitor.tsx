import {useEffect, useState} from "react";
import Section from "@componente/Section";
import Card from "@componente/Card";
import {Check, ChevronRight, HandHeart, XCircle} from "lucide-react";

const PIX_KEY = "movimentokairos23@gmail.com";

const COPY_STATES = {
    idle: "Copiar chave Pix",
    copied: "Chave copiada!",
    error: "Falha ao copiar. Tente novamente.",
} as const;

type CopyState = keyof typeof COPY_STATES;

const copyToClipboard = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    // Fallback para navegadores que não suportam Clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.left = "-1000px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!successful) {
        throw new Error("Clipboard fallback failed");
    }
};

export default function Benfeitor() {
    const [copyState, setCopyState] = useState<CopyState>("idle");

    useEffect(() => {
        if (copyState === "idle") return undefined;
        const timeout = setTimeout(() => setCopyState("idle"), 2000);
        return () => clearTimeout(timeout);
    }, [copyState]);

    const handleCopyClick = async () => {
        try {
            await copyToClipboard(PIX_KEY);
            setCopyState("copied");
        } catch (error) {
            console.error("[Benfeitor] copy pix key failed", error);
            setCopyState("error");
        }
    };

    const renderButtonContent = () => {
        switch (copyState) {
            case "copied":
                return (
                    <>
                        <Check className="size-4"/>
                        {COPY_STATES.copied}
                    </>
                );
            case "error":
                return (
                    <>
                        <XCircle className="size-4"/>
                        {COPY_STATES.error}
                    </>
                );
            default:
                return (
                    <>
                        {COPY_STATES.idle} <ChevronRight className="size-4"/>
                    </>
                );
        }
    };

    return (
        <Section title="Seja um Benfeitor"
                 subtitle="Sua doação ajuda a sustentar as frentes de evangelização e acolhimento.">
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <HandHeart className="size-6"/>
                        <div className="text-lg font-semibold">Doação via Pix</div>
                    </div>
                    <p className="mt-3 text-muted-foreground">Use a chave Pix abaixo para contribuir com qualquer
                        valor.</p>
                    <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 items-center">
                        <img src="/assets/img/qrcode-kairos.png" alt="QR Code" className="w-28 h-28 object-contain"/>
                        <div>
                            <div className="text-sm text-muted-foreground">Chave Pix</div>
                            <div className="font-mono text-base md:text-lg select-all">{PIX_KEY}</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopyClick}
                        className={`mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                            copyState === "copied"
                                ? "bg-emerald-500 text-white border-emerald-600"
                                : copyState === "error"
                                    ? "bg-red-500 text-white border-red-600"
                                    : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        aria-live="polite"
                    >
                        {renderButtonContent()}
                    </button>
                </Card>
                <Card className="p-6">
                    <div className="text-lg font-semibold">Transparência</div>
                    <p className="mt-3 text-muted-foreground">
                        Publicaremos relatórios de prestação de contas a cada edição do KASA e atividades do movimento.
                    </p>
                    <ul className="mt-4 list-disc pl-5 text-muted-foreground space-y-1">
                        <li>Sem fins lucrativos e sem apoio financeiro externo.</li>
                        <li>Colaboração de pessoas comprometidas com causas sociais.</li>
                        <li>Uso responsável dos recursos e prioridades missionárias.</li>
                    </ul>
                </Card>
            </div>
        </Section>
    );
}
