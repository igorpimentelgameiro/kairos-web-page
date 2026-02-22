import {useEffect, useMemo, useState} from "react";
import type {ChangeEvent, FormEvent} from "react";
import Section from "@componente/Section";
import Card from "@componente/Card";
import {ArrowLeft, CalendarClock, Check, ClipboardCheck, Copy, KeyRound, MapPin, Shield, XCircle} from "lucide-react";
import {salvarInscricao} from "@dominio/servicos/inscricaoFirebaseServico";
import type {ComprovantePagamentoDto, InscricaoRequestDto} from "@dominio/dto/inscricaoDto";

type InscricaoRetiroKasaIIIProps = {
    onVoltar: () => void;
};

type SimNao = "SIM" | "NAO";
type FormaPagamento = "PIX" | "CREDITO" | "DINHEIRO";
type TamanhoCamisa = "PP" | "P" | "M" | "G" | "GG" | "XG";

type TalentoValue =
    | "CANTAR"
    | "TOCAR"
    | "DANCAR"
    | "FALAR_PUBLICO"
    | "TEATRO"
    | "DESENHO"
    | "FOTOGRAFIA"
    | "AUDIO_VISUAL"
    | "OUTROS";

type InscricaoFormData = {
    nomeCompleto: string;
    dataNascimento: string;
    idade: string;
    menorIdade: SimNao;
    responsavelNome: string;
    responsavelContato: string;
    documento: string;
    contato: string;
    endereco: string;
    tamanhoCamisa: TamanhoCamisa | "";
    contatoEmergenciaNome: string;
    contatoEmergenciaParentesco: string;
    contatoEmergenciaContato: string;
    alergias: string;
    necessidadesEspeciais: string;
    jaParticipouRetiro: SimNao;
    comunidadeOrigem: string;
    dons: TalentoValue[];
    outrosDons: string;
    formaPagamento: FormaPagamento | "";
    comprovantePagamento: File | null;
    consentimentoImagem: boolean;
    consentimentoDados: boolean;
    observacoes: string;
};

const CONSENTIMENTO_TEXT =
    "Ao preencher e enviar este formulário, você consente com o tratamento dos seus dados pessoais e com o uso de suas imagens, sons e vídeos para fins relacionados à inscrição, organização e divulgação do evento, conforme a LGPD (Lei nº 13.709/2018). Você pode revogar esse consentimento a qualquer momento pelo e-mail movimentokairos23@gmail.com ou WhatsApp (91) 98615-3379.";

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

const TALENTO_OPTIONS: Array<{value: TalentoValue; label: string}> = [
    {value: "CANTAR", label: "Cantar"},
    {value: "TOCAR", label: "Tocar instrumento"},
    {value: "DANCAR", label: "Dançar"},
    {value: "FALAR_PUBLICO", label: "Falar em público"},
    {value: "TEATRO", label: "Teatro"},
    {value: "DESENHO", label: "Desenho"},
    {value: "FOTOGRAFIA", label: "Fotografia"},
    {value: "AUDIO_VISUAL", label: "Áudio e visual"},
    {value: "OUTROS", label: "Outros talentos (descrever)"},
];

const SHIRT_SIZES: Array<{value: TamanhoCamisa; label: string}> = [
    {value: "PP", label: "PP"},
    {value: "P", label: "P"},
    {value: "M", label: "M"},
    {value: "G", label: "G"},
    {value: "GG", label: "GG"},
    {value: "XG", label: "XG"},
];

const PAYMENT_OPTIONS: Array<{value: FormaPagamento; label: string}> = [
    {value: "PIX", label: "PIX"},
    {value: "CREDITO", label: "Cartão de crédito"},
    {value: "DINHEIRO", label: "Dinheiro"},
];

const criarFormularioInicial = (): InscricaoFormData => ({
    nomeCompleto: "",
    dataNascimento: "",
    idade: "",
    menorIdade: "NAO",
    responsavelNome: "",
    responsavelContato: "",
    documento: "",
    contato: "",
    endereco: "",
    tamanhoCamisa: "",
    contatoEmergenciaNome: "",
    contatoEmergenciaParentesco: "",
    contatoEmergenciaContato: "",
    alergias: "",
    necessidadesEspeciais: "",
    jaParticipouRetiro: "NAO",
    comunidadeOrigem: "",
    dons: [],
    outrosDons: "",
    formaPagamento: "",
    comprovantePagamento: null,
    consentimentoImagem: false,
    consentimentoDados: false,
    observacoes: "",
});

const FIELD_BASE_CLASS =
    "border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40";

const TEXTAREA_CLASS = `${FIELD_BASE_CLASS} min-h-[96px]`;

const PHONE_INPUT_PATTERN = /^(\+?55\s?)?\(?\d{2}\)?\s?(9\s?)?\d{4}-?\d{4}$/;
const MAX_COMPROVANTE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_COMPROVANTE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "application/pdf",
    "image/heic",
    "image/heif",
]);

const sanitizePhone = (value: string): string => value.replace(/\D/g, "");

const toE164Phone = (value: string): string | null => {
    const digits = sanitizePhone(value);
    if (digits.length < 10) {
        return null;
    }
    let localDigits = digits;
    if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
        localDigits = digits.slice(2);
    }
    if (localDigits.length === 11 || localDigits.length === 10) {
        return `+55${localDigits}`;
    }
    return null;
};

const formatPhone = (value: string): string => {
    const digits = sanitizePhone(value);
    let localDigits = digits;
    if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
        localDigits = digits.slice(2);
    }
    if (localDigits.length === 11) {
        const ddd = localDigits.slice(0, 2);
        const primeira = localDigits.slice(2, 3);
        const meio = localDigits.slice(3, 7);
        const fim = localDigits.slice(7);
        return `(${ddd}) ${primeira}${meio}-${fim}`;
    }
    if (localDigits.length === 10) {
        const ddd = localDigits.slice(0, 2);
        const meio = localDigits.slice(2, 6);
        const fim = localDigits.slice(6);
        return `(${ddd}) ${meio}-${fim}`;
    }
    return value.trim();
};

const isValidPhone = (value: string): boolean => toE164Phone(value) !== null;

type SubmissionStatus = "idle" | "loading" | "success" | "error";

const mapFormToDto = (
    dados: InscricaoFormData,
    comprovante?: ComprovantePagamentoDto | null,
): InscricaoRequestDto => {
    const donsSelecionados = dados.dons
        .map((valor) => {
            if (valor === "OUTROS") {
                return dados.outrosDons.trim();
            }
            const label = TALENTO_OPTIONS.find((opcao) => opcao.value === valor)?.label;
            return label ?? valor;
        })
        .filter((valor) => valor.length > 0);

    const donsHabilidades =
        donsSelecionados.length > 0 ? donsSelecionados.join(", ") : "Não informado";

    const responsavelLegal =
        dados.menorIdade === "SIM"
            ? {
                  nome: dados.responsavelNome.trim(),
                  contato: dados.responsavelContato.trim(),
              }
            : null;

    const idade = Number.parseInt(dados.idade, 10);
    const telefoneE164 = toE164Phone(dados.contato);

    if (!telefoneE164) {
        throw new Error("Telefone inválido.");
    }

    return {
        nomeCompleto: dados.nomeCompleto.trim(),
        dataNascimento: dados.dataNascimento,
        idade: Number.isNaN(idade) ? 0 : idade,
        responsavelLegal,
        documentoIdentificacao: dados.documento.trim(),
        contatoIndividual: telefoneE164,
        endereco: dados.endereco.trim(),
        tamanhoCamisa: dados.tamanhoCamisa,
        contatoEmergencia: {
            nome: dados.contatoEmergenciaNome.trim(),
            parentesco: dados.contatoEmergenciaParentesco.trim(),
            contato: dados.contatoEmergenciaContato.trim(),
        },
        alergiasIntolerancias: dados.alergias.trim() ? dados.alergias.trim() : null,
        necessidadesEspeciais: dados.necessidadesEspeciais.trim()
            ? dados.necessidadesEspeciais.trim()
            : null,
        participouDeRetiro: dados.jaParticipouRetiro === "SIM",
        comunidadeOrigem: dados.comunidadeOrigem.trim(),
        donsHabilidades,
        formaPagamento: dados.formaPagamento as FormaPagamento,
        comprovantePagamento: comprovante ?? null,
        consentimentoImagem: dados.consentimentoImagem,
        consentimentoDados: dados.consentimentoDados,
        observacoes: dados.observacoes.trim() ? dados.observacoes.trim() : null,
    };
};

export default function InscricaoRetiroKasaIII({onVoltar}: InscricaoRetiroKasaIIIProps) {
    const [form, setForm] = useState<InscricaoFormData>(() => criarFormularioInicial());
    const [status, setStatus] = useState<SubmissionStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [submittedName, setSubmittedName] = useState("");
    const [submittedContato, setSubmittedContato] = useState("");
    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [pixCopyState, setPixCopyState] = useState<CopyState>("idle");

    const limparFeedback = () => {
        if (status === "success" || status === "error") {
            setStatus("idle");
            setErrorMessage(null);
            setSubmissionId(null);
        }
    };

    const updateField = <K extends keyof InscricaoFormData>(field: K, value: InscricaoFormData[K]) => {
        setForm((prev) => ({...prev, [field]: value}));
        limparFeedback();
    };

    const handleTextChange =
        (field: keyof InscricaoFormData) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            updateField(field, event.target.value);
        };

    const handleRadioChange =
        <K extends keyof Pick<InscricaoFormData, "menorIdade" | "jaParticipouRetiro" | "formaPagamento">>(
            field: K,
        ) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            updateField(field, event.target.value as InscricaoFormData[K]);
        };

    const handleTalentToggle = (value: TalentoValue) => (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setForm((prev) => {
            const dons = checked
                ? Array.from(new Set([...prev.dons, value]))
                : prev.dons.filter((item) => item !== value);
            const outrosSelecionado = dons.includes("OUTROS");
            return {...prev, dons, outrosDons: outrosSelecionado ? prev.outrosDons : ""};
        });
        limparFeedback();
    };

    const handleConsentChange =
        (field: "consentimentoDados" | "consentimentoImagem") =>
        (event: ChangeEvent<HTMLInputElement>) => {
            updateField(field, event.target.checked);
        };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (!file) {
            updateField("comprovantePagamento", null);
            return;
        }
        if (file.size > MAX_COMPROVANTE_SIZE_BYTES) {
            setStatus("error");
            setErrorMessage("Comprovante muito grande. Envie arquivo de até 4MB.");
            updateField("comprovantePagamento", null);
            return;
        }
        if (file.type && !ALLOWED_COMPROVANTE_TYPES.has(file.type)) {
            setStatus("error");
            setErrorMessage("Formato inválido. Use JPG, PNG, PDF ou HEIC.");
            updateField("comprovantePagamento", null);
            return;
        }
        updateField("comprovantePagamento", file);
    };

    useEffect(() => {
        if (pixCopyState === "idle") return undefined;
        const timeout = setTimeout(() => setPixCopyState("idle"), 2000);
        return () => clearTimeout(timeout);
    }, [pixCopyState]);

    const handleCopyPix = async () => {
        try {
            await copyToClipboard(PIX_KEY);
            setPixCopyState("copied");
        } catch (error) {
            console.error("[InscricaoRetiroKasaIII] copy pix key failed", error);
            setPixCopyState("error");
        }
    };

    const feedback = useMemo(() => {
        if (status === "success") {
            const primeiroNome = submittedName.trim().split(" ")[0] || "participante";
            const contatoMensagem = submittedContato
                ? ` pelo número informado (${submittedContato})`
                : "";
            const protocolo = submissionId ? ` • Protocolo: ${submissionId}` : "";
            return `Obrigado, ${primeiroNome}! Recebemos a sua inscrição e entraremos em contato${contatoMensagem} para confirmar as próximas etapas.${protocolo}`;
        }
        return null;
    }, [status, submissionId, submittedContato, submittedName]);

    const isMenor = form.menorIdade === "SIM";

    const isValid =
        form.nomeCompleto.trim() !== "" &&
        form.dataNascimento.trim() !== "" &&
        form.idade.trim() !== "" &&
        form.documento.trim() !== "" &&
        isValidPhone(form.contato) &&
        form.endereco.trim() !== "" &&
        form.tamanhoCamisa !== "" &&
        form.contatoEmergenciaNome.trim() !== "" &&
        form.contatoEmergenciaParentesco.trim() !== "" &&
        form.contatoEmergenciaContato.trim() !== "" &&
        form.formaPagamento !== "" &&
        (form.formaPagamento !== "PIX" || form.comprovantePagamento !== null) &&
        form.consentimentoDados &&
        form.consentimentoImagem &&
        (!form.dons.includes("OUTROS") || form.outrosDons.trim().length > 0) &&
        (!isMenor ||
            (form.responsavelNome.trim() !== "" && form.responsavelContato.trim() !== ""));

const arquivoParaBase64 = (arquivo: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const resultado = reader.result;
            if (typeof resultado !== "string") {
                reject(new Error("Não foi possível processar o arquivo selecionado."));
                return;
            }
            const base64 = resultado.includes(",") ? resultado.split(",")[1] : resultado;
            resolve(base64);
        };
        reader.onerror = () => reject(new Error("Falha ao ler o arquivo selecionado."));
        reader.readAsDataURL(arquivo);
    });

const criarComprovanteBase64 = async (arquivo: File): Promise<ComprovantePagamentoDto> => {
    const conteudoBase64 = (await arquivoParaBase64(arquivo)).replace(/[\r\n\s]/g, "");
    return {
        nomeArquivo: arquivo.name,
        mimeType: arquivo.type || "application/octet-stream",
        conteudoBase64,
        enviadoEm: new Date().toISOString(),
    };
};

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValid) {
            if (form.formaPagamento === "PIX" && !form.comprovantePagamento) {
                setStatus("error");
                setErrorMessage("Para pagamento via Pix, o comprovante é obrigatório.");
            }
            return;
        }
        try {
            setStatus("loading");
            setErrorMessage(null);
            let comprovanteDto: ComprovantePagamentoDto | null = null;
            if (form.comprovantePagamento && form.formaPagamento === "PIX") {
                comprovanteDto = await criarComprovanteBase64(form.comprovantePagamento);
            }
            const payload = mapFormToDto(form, comprovanteDto);
            const telefoneFormatado = formatPhone(form.contato);
            const identificador = await salvarInscricao(payload);
            setSubmittedName(form.nomeCompleto);
            setSubmittedContato(telefoneFormatado);
            setSubmissionId(identificador);
            setStatus("success");
            setForm(criarFormularioInicial());
        } catch (error) {
            console.error("[InscricaoRetiroKasaIII] erro ao salvar inscrição", error);
            const mensagem =
                error instanceof Error && error.message
                    ? `Não foi possível enviar sua inscrição: ${error.message}`
                    : "Não foi possível enviar sua inscrição. Tente novamente em instantes.";
            setErrorMessage(mensagem);
            setStatus("error");
        }
    };

    return (
        <div className="space-y-8">
            <div className="max-w-6xl mx-auto px-4 pt-8">
                <button
                    type="button"
                    onClick={onVoltar}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                    <ArrowLeft className="size-4"/> Voltar para informações do KASA
                </button>
            </div>

            <Section
                title="Inscrição Retiro Kasa III"
                subtitle="Preencha o formulário completo para reservar sua vaga. Nossa equipe confirmará os dados e enviará as instruções finais."
            >
                <div className="grid md:grid-cols-[2fr,3fr] gap-6">
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <CalendarClock className="size-6"/>
                            <div>
                                <div className="text-lg font-semibold">20 a 22 de março de 2026</div>
                                <div className="text-sm text-muted-foreground">Benevides • Centro de Espiritualidade
                                    Nossa Senhora Mãe da Divina Providência</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin className="size-5"/> Avenida Conselheiro Furtado, 1571 — Nazaré
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Shield className="size-5"/> Vagas limitadas, confirmação mediante contato da equipe.
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <KeyRound className="size-5"/>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-foreground">Chave Pix:</span>
                                <span className="font-mono text-foreground select-all">{PIX_KEY}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyPix}
                                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold transition ${
                                        pixCopyState === "copied"
                                            ? "bg-emerald-500 text-white border-emerald-600"
                                            : pixCopyState === "error"
                                                ? "bg-red-500 text-white border-red-600"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                    aria-live="polite"
                                >
                                    {pixCopyState === "copied" ? <Check className="size-3"/> : null}
                                    {pixCopyState === "error" ? <XCircle className="size-3"/> : null}
                                    {pixCopyState === "idle" ? <Copy className="size-3"/> : null}
                                    {COPY_STATES[pixCopyState]}
                                </button>
                            </div>
                        </div>
                        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground flex gap-3 items-start">
                            <ClipboardCheck className="size-5 mt-0.5"/>
                            <p>
                                A inscrição é confirmada após validação dos dados, envio do comprovante(pix) e aceite dos termos
                                de privacidade. Entraremos em contato para orientações adicionais e acompanhamento
                                espiritual.
                            </p>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-5">
                        <div>
                            <h3 className="text-lg font-semibold">Dados do participante</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Utilize informações atualizadas para contato. Em caso de dúvidas, procure a equipe do
                                Movimento Kairós.</p>
                                <p>movimentokairos23@gmail.com</p>
                                <p>+55 (91) 98615-3379</p>
                        </div>
                        <form className="grid gap-5" onSubmit={handleSubmit}>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground" htmlFor="inscricao-nome">
                                        Nome completo
                                    </label>
                                    <input
                                        id="inscricao-nome"
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Digite seu nome completo"
                                        value={form.nomeCompleto}
                                        onChange={handleTextChange("nomeCompleto")}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label
                                        className="text-sm font-medium text-muted-foreground"
                                        htmlFor="inscricao-documento"
                                    >
                                        RG ou CPF
                                    </label>
                                    <input
                                        id="inscricao-documento"
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Informe seu RG ou CPF"
                                        value={form.documento}
                                        onChange={handleTextChange("documento")}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label
                                        className="text-sm font-medium text-muted-foreground"
                                        htmlFor="inscricao-data-nascimento"
                                    >
                                        Data de nascimento
                                    </label>
                                    <input
                                        id="inscricao-data-nascimento"
                                        type="date"
                                        className={FIELD_BASE_CLASS}
                                        value={form.dataNascimento}
                                        onChange={handleTextChange("dataNascimento")}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground" htmlFor="inscricao-idade">
                                        Idade
                                    </label>
                                    <input
                                        id="inscricao-idade"
                                        type="number"
                                        min={1}
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Informe sua idade"
                                        value={form.idade}
                                        onChange={handleTextChange("idade")}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <span className="text-sm font-medium text-muted-foreground">
                                    É menor de idade?
                                </span>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {(["SIM", "NAO"] as SimNao[]).map((value) => (
                                        <label key={value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="menor-idade"
                                                value={value}
                                                checked={form.menorIdade === value}
                                                onChange={handleRadioChange("menorIdade")}
                                            />
                                            {value === "SIM" ? "Sim" : "Não"}
                                        </label>
                                    ))}
                                </div>
                                {isMenor ? (
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="grid gap-2">
                                            <label
                                                className="text-sm font-medium text-muted-foreground"
                                                htmlFor="responsavel-nome"
                                            >
                                                Nome do responsável legal
                                            </label>
                                            <input
                                                id="responsavel-nome"
                                                className={FIELD_BASE_CLASS}
                                                placeholder="Nome completo do responsável"
                                                value={form.responsavelNome}
                                                onChange={handleTextChange("responsavelNome")}
                                                required={isMenor}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label
                                                className="text-sm font-medium text-muted-foreground"
                                                htmlFor="responsavel-contato"
                                            >
                                                Contato do responsável
                                            </label>
                                            <input
                                                id="responsavel-contato"
                                                className={FIELD_BASE_CLASS}
                                                placeholder="Telefone ou e-mail do responsável"
                                                value={form.responsavelContato}
                                                onChange={handleTextChange("responsavelContato")}
                                                required={isMenor}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground" htmlFor="inscricao-contato">
                                        Contato individual (WhatsApp / celular)
                                    </label>
                                    <input
                                        id="inscricao-contato"
                                        type="tel"
                                        inputMode="tel"
                                        pattern={PHONE_INPUT_PATTERN.source}
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Ex.: (91) 9 9999-9999"
                                        value={form.contato}
                                        onChange={handleTextChange("contato")}
                                        required
                                        aria-invalid={form.contato !== "" && !isValidPhone(form.contato)}
                                        title="Informe um número de celular válido com DDD. Ex.: (91) 9 9999-9999"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground" htmlFor="inscricao-endereco">
                                        Endereço completo
                                    </label>
                                    <input
                                        id="inscricao-endereco"
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Rua, número, bairro, cidade"
                                        value={form.endereco}
                                        onChange={handleTextChange("endereco")}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Tamanho da camisa
                                    </label>
                                    <select
                                        className={FIELD_BASE_CLASS}
                                        value={form.tamanhoCamisa}
                                        onChange={(event) =>
                                            updateField("tamanhoCamisa", event.target.value as TamanhoCamisa)
                                        }
                                        required
                                    >
                                        <option value="">Selecione seu tamanho</option>
                                        {SHIRT_SIZES.map(({value, label}) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <label
                                        className="text-sm font-medium text-muted-foreground"
                                        htmlFor="inscricao-observacoes"
                                    >
                                        Observações gerais
                                    </label>
                                    <input
                                        id="inscricao-observacoes"
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Informações adicionais relevantes"
                                        value={form.observacoes}
                                        onChange={handleTextChange("observacoes")}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Contato de emergência
                                    </span>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <input
                                            className={FIELD_BASE_CLASS}
                                            placeholder="Nome"
                                            value={form.contatoEmergenciaNome}
                                            onChange={handleTextChange("contatoEmergenciaNome")}
                                            required
                                        />
                                        <input
                                            className={FIELD_BASE_CLASS}
                                            placeholder="Parentesco"
                                            value={form.contatoEmergenciaParentesco}
                                            onChange={handleTextChange("contatoEmergenciaParentesco")}
                                            required
                                        />
                                        <input
                                            className={FIELD_BASE_CLASS}
                                            placeholder="Contato (WhatsApp/telefone)"
                                            value={form.contatoEmergenciaContato}
                                            onChange={handleTextChange("contatoEmergenciaContato")}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <label className="text-sm font-medium text-muted-foreground" htmlFor="inscricao-alergias">
                                        Possui alguma alergia ou intolerância alimentar?
                                    </label>
                                    <textarea
                                        id="inscricao-alergias"
                                        className={TEXTAREA_CLASS}
                                        placeholder="Descreva alergias, intolerâncias ou informe 'Não tenho'"
                                        value={form.alergias}
                                        onChange={handleTextChange("alergias")}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <label
                                        className="text-sm font-medium text-muted-foreground"
                                        htmlFor="inscricao-necessidades"
                                    >
                                        Necessidade especial, uso de medicação ou necessidade de auxílio?
                                    </label>
                                    <textarea
                                        id="inscricao-necessidades"
                                        className={TEXTAREA_CLASS}
                                        placeholder="Informe condições específicas ou 'Não possuo'"
                                        value={form.necessidadesEspeciais}
                                        onChange={handleTextChange("necessidadesEspeciais")}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Já participou de algum retiro?
                                    </span>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {(["SIM", "NAO"] as SimNao[]).map((value) => (
                                            <label key={value} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="ja-participou-retiro"
                                                    value={value}
                                                    checked={form.jaParticipouRetiro === value}
                                                    onChange={handleRadioChange("jaParticipouRetiro")}
                                                />
                                                {value === "SIM" ? "Sim" : "Ainda não"}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        className="text-sm font-medium text-muted-foreground"
                                        htmlFor="inscricao-comunidade"
                                    >
                                        Paróquia, comunidade, grupo ou movimento de origem
                                    </label>
                                    <input
                                        id="inscricao-comunidade"
                                        className={FIELD_BASE_CLASS}
                                        placeholder="Ex.: Basílica de Nazaré • Grupo de Oração Kairós"
                                        value={form.comunidadeOrigem}
                                        onChange={handleTextChange("comunidadeOrigem")}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Possui algum dom? Selecione os que se aplicam
                                    </span>
                                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                                        {TALENTO_OPTIONS.map(({value, label}) => (
                                            <label key={value} className="inline-flex items-start gap-2 rounded-xl border px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1"
                                                    checked={form.dons.includes(value)}
                                                    onChange={handleTalentToggle(value)}
                                                />
                                                <span>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {form.dons.includes("OUTROS") ? (
                                        <input
                                            className={FIELD_BASE_CLASS}
                                            placeholder="Descreva outros talentos"
                                            value={form.outrosDons}
                                            onChange={handleTextChange("outrosDons")}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Forma de pagamento</span>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {PAYMENT_OPTIONS.map(({value, label}) => (
                                            <label key={value} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="forma-pagamento"
                                                    value={value}
                                                    checked={form.formaPagamento === value}
                                                    onChange={handleRadioChange("formaPagamento")}
                                                    required
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Cartão de crédito e dinheiro são pagos presencialmente; apenas Pix exige envio do comprovante.
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        className="text-sm font-medium text-muted-foreground"
                                        htmlFor="inscricao-comprovante"
                                    >
                                        Comprovante de pagamento
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Obrigatório somente para pagamentos via Pix.
                                    </p>
                                    <input
                                        id="inscricao-comprovante"
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="text-sm"
                                        onChange={handleFileChange}
                                    />
                                    {form.comprovantePagamento ? (
                                        <span className="text-xs text-muted-foreground">
                                            Arquivo selecionado: {form.comprovantePagamento.name}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid gap-3 rounded-xl border p-4 bg-muted/40">
                                <p className="text-sm text-muted-foreground">{CONSENTIMENTO_TEXT}</p>
                                <label className="flex items-start gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={form.consentimentoDados}
                                        onChange={handleConsentChange("consentimentoDados")}
                                        required
                                    />
                                    <span>
                                        Declaro que li e concordo com o tratamento dos meus dados pessoais conforme a LGPD.
                                    </span>
                                </label>
                                <label className="flex items-start gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={form.consentimentoImagem}
                                        onChange={handleConsentChange("consentimentoImagem")}
                                        required
                                    />
                                    <span>Autorizo o uso da minha imagem, voz e registros para divulgação do evento.</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={!isValid || status === "loading"}
                            >
                                {status === "loading" ? "Enviando..." : "Enviar inscrição"}
                            </button>
                        </form>
                        {errorMessage ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                {errorMessage}
                            </div>
                        ) : null}
                        {feedback ? (
                            <div className="rounded-xl border p-4 bg-primary/5 text-sm text-primary">
                                {feedback}
                            </div>
                        ) : null}
                    </Card>
                </div>
            </Section>
        </div>
    );
}
