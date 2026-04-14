import {useEffect, useMemo, useRef, useState} from "react";
import type {ChangeEvent, FormEvent} from "react";
import {ChevronDown, ChevronUp, LayoutList} from "lucide-react";
import type {InscricaoRegistrada} from "@dominio/servicos/inscricaoFirebaseServico";
import {
    atualizarInscricao,
    listarInscricoes,
    removerInscricoes,
} from "@dominio/servicos/inscricaoFirebaseServico";
import type {ComprovantePagamentoDto} from "@dominio/dto/inscricaoDto";
import {sair} from "@dominio/servicos/authServico";

type Coluna = {
    key: string;
    label: string;
    accessor: (inscricao: InscricaoRegistrada) => string;
};

const formatPhone = (value?: string | null): string => {
    if (!value) return "-";
    const digits = value.replace(/\D/g, "");
    if (digits.length === 13 && digits.startsWith("55")) {
        const local = digits.slice(2);
        return `(${local.slice(0, 2)}) ${local.slice(2, 3)}${local.slice(3, 7)}-${local.slice(7)}`;
    }
    if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    return value;
};

const formatBoolean = (value?: boolean): string => (value ? "Sim" : "Não");

const formatDate = (isoDate?: string): string => {
    if (!isoDate) return "-";
    try {
        return new Date(isoDate).toLocaleDateString("pt-BR");
    } catch {
        return isoDate;
    }
};

const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString("pt-BR");
};

const extrairComprovanteNome = (
    comprovante: InscricaoRegistrada["comprovantePagamento"],
): string => {
    if (!comprovante) return "-";
    return comprovante.nomeArquivo || comprovante.url || "-";
};

const COLUNAS: Coluna[] = [
    {key: "nomeCompleto", label: "Nome completo", accessor: (i) => i.nomeCompleto ?? "-"},
    {key: "dataNascimento", label: "Data de nascimento", accessor: (i) => formatDate(i.dataNascimento)},
    {key: "idade", label: "Idade", accessor: (i) => String(i.idade ?? "-")},
    {
        key: "responsavelNome",
        label: "Responsável legal",
        accessor: (i) => i.responsavelLegal?.nome ?? "-",
    },
    {
        key: "responsavelContato",
        label: "Contato responsável",
        accessor: (i) => i.responsavelLegal?.contato ?? "-",
    },
    {
        key: "documentoIdentificacao",
        label: "RG/CPF",
        accessor: (i) => i.documentoIdentificacao ?? "-",
    },
    {
        key: "contatoIndividual",
        label: "Contato individual",
        accessor: (i) => formatPhone(i.contatoIndividual),
    },
    {key: "endereco", label: "Endereço", accessor: (i) => i.endereco ?? "-"},
    {key: "tamanhoCamisa", label: "Camisa", accessor: (i) => i.tamanhoCamisa ?? "-"},
    {
        key: "contatoEmergenciaNome",
        label: "Contato emerg. (Nome)",
        accessor: (i) => i.contatoEmergencia?.nome ?? "-",
    },
    {
        key: "contatoEmergenciaParentesco",
        label: "Contato emerg. (Parentesco)",
        accessor: (i) => i.contatoEmergencia?.parentesco ?? "-",
    },
    {
        key: "contatoEmergenciaContato",
        label: "Contato emerg. (Telefone)",
        accessor: (i) => formatPhone(i.contatoEmergencia?.contato),
    },
    {
        key: "alergiasIntolerancias",
        label: "Alergias / intolerâncias",
        accessor: (i) => i.alergiasIntolerancias ?? "-",
    },
    {
        key: "necessidadesEspeciais",
        label: "Necessidades especiais",
        accessor: (i) => i.necessidadesEspeciais ?? "-",
    },
    {
        key: "participouDeRetiro",
        label: "Já participou de retiro?",
        accessor: (i) => formatBoolean(i.participouDeRetiro),
    },
    {
        key: "comunidadeOrigem",
        label: "Comunidade / origem",
        accessor: (i) => i.comunidadeOrigem ?? "-",
    },
    {
        key: "donsHabilidades",
        label: "Dons e habilidades",
        accessor: (i) => i.donsHabilidades ?? "-",
    },
    {
        key: "formaPagamento",
        label: "Forma de pagamento",
        accessor: (i) => i.formaPagamento ?? "-",
    },
    {
        key: "comprovantePagamento",
        label: "Comprovante",
        accessor: (i) => extrairComprovanteNome(i.comprovantePagamento),
    },
    {
        key: "consentimentoImagem",
        label: "Consentimento imagem",
        accessor: (i) => formatBoolean(i.consentimentoImagem),
    },
    {
        key: "consentimentoDados",
        label: "Consentimento dados",
        accessor: (i) => formatBoolean(i.consentimentoDados),
    },
    {
        key: "observacoes",
        label: "Observações",
        accessor: (i) => i.observacoes ?? "-",
    },
    {
        key: "criadoEm",
        label: "Inscrição em",
        accessor: (i) => formatTimestamp(i.criadoEm),
    },
];

type FaixaEtaria = "menores" | "maiores";

const FAIXA_ETARIA_OPCOES: Array<{valor: FaixaEtaria; rotulo: string}> = [
    {valor: "menores", rotulo: "Menores de 18 anos"},
    {valor: "maiores", rotulo: "18 anos ou mais"},
];

const FORMA_PAGAMENTO_OPCOES: Array<{valor: InscricaoRegistrada["formaPagamento"]; rotulo: string}> = [
    {valor: "PIX", rotulo: "PIX"},
    {valor: "CREDITO", rotulo: "Cartão de crédito"},
    {valor: "DINHEIRO", rotulo: "Dinheiro"},
];

const compararColuna = (a: InscricaoRegistrada, b: InscricaoRegistrada, colunaKey: string): number => {
    if (colunaKey === "idade") {
        const valorA = a.idade ?? 0;
        const valorB = b.idade ?? 0;
        return valorA - valorB;
    }
    const coluna = COLUNAS.find((col) => col.key === colunaKey);
    if (!coluna) return 0;
    const valorA = coluna.accessor(a).toLowerCase();
    const valorB = coluna.accessor(b).toLowerCase();
    return valorA.localeCompare(valorB, "pt-BR", {numeric: true, sensitivity: "base"});
};

const ehMenor = (idade?: number): boolean => (idade ?? 0) < 18;

type ComprovanteCellProps = {
    comprovante?: ComprovantePagamentoDto | null;
    fallback: string;
};

const extrairPathDaUrl = (url: string): string | null => {
    try {
        const parsed = new URL(url);
        const nameParam = parsed.searchParams.get("name");
        if (nameParam) {
            return decodeURIComponent(nameParam);
        }
        const match = parsed.pathname.split("/o/")[1];
        if (match) {
            const [path] = match.split("?");
            return decodeURIComponent(path);
        }
    } catch {
        return null;
    }
    return null;
};

const criarUrlBase64 = (conteudoBase64: string, mimeType: string): string | null => {
    try {
        const limpo = conteudoBase64.includes(",")
            ? conteudoBase64.split(",")[1]
            : conteudoBase64.trim();
        const byteString = atob(limpo.replace(/[\r\n\s]/g, ""));
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i += 1) {
            byteArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], {type: mimeType || "application/octet-stream"});
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("[ComprovanteCell] falha ao converter base64:", error);
        return null;
    }
};

const ComprovanteCell = ({comprovante, fallback}: ComprovanteCellProps) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    const link = useMemo(() => {
        if (!comprovante) {
            return null;
        }
        if (comprovante.url) {
            return comprovante.url;
        }
        return blobUrl;
    }, [blobUrl, comprovante]);

    useEffect(() => {
        if (!comprovante?.conteudoBase64) {
            setBlobUrl(null);
            return undefined;
        }
        const url = criarUrlBase64(comprovante.conteudoBase64, comprovante.mimeType);
        if (!url) {
            setBlobUrl(null);
            return undefined;
        }
        setBlobUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [comprovante?.conteudoBase64, comprovante?.mimeType]);

    if (!comprovante) {
        return <span>{fallback || "-"}</span>;
    }

    if (link) {
        return (
            <div className="flex flex-col gap-0.5">
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm"
                >
                    Ver comprovante
                </a>
                <span className="text-xs text-muted-foreground">{comprovante.nomeArquivo}</span>
            </div>
        );
    }

    return <span>{fallback || "Sem comprovante."}</span>;
};

const normalizarTextoCsv = (valor: string): string =>
    valor
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const gerarCsv = (inscricoes: InscricaoRegistrada[]): string => {
    const cabecalhos = ["ID", ...COLUNAS.map((coluna) => coluna.label)];
    const linhas = inscricoes.map((inscricao) => [
        inscricao.id,
        ...COLUNAS.map((coluna) => coluna.accessor(inscricao)),
    ]);
    const todasAsLinhas = [cabecalhos, ...linhas];
    return todasAsLinhas
        .map((linha) =>
            linha
                .map((valor) => {
                    const texto = normalizarTextoCsv(String(valor ?? ""));
                    if (texto.includes(";") || texto.includes('"')) {
                        return `"${texto.replace(/"/g, '""')}"`;
                    }
                    return texto;
                })
                .join(";"),
        )
        .join("\n");
};

export default function AdminDashboard() {
    const [inscricoes, setInscricoes] = useState<InscricaoRegistrada[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [logoutCarregando, setLogoutCarregando] = useState(false);
    const [logoutErro, setLogoutErro] = useState<string | null>(null);
    const [faixasSelecionadas, setFaixasSelecionadas] = useState<FaixaEtaria[]>(() =>
        FAIXA_ETARIA_OPCOES.map((opcao) => opcao.valor),
    );
    const [ordenacao, setOrdenacao] = useState<{key: string; direction: "asc" | "desc"} | null>(null);
    const [editando, setEditando] = useState<InscricaoRegistrada | null>(null);
    const [formData, setFormData] = useState<InscricaoRegistrada | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [salvarErro, setSalvarErro] = useState<string | null>(null);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [excluindo, setExcluindo] = useState(false);
    const [excluirErro, setExcluirErro] = useState<string | null>(null);
    const selectAllRef = useRef<HTMLInputElement | null>(null);
    const [exportando, setExportando] = useState(false);
    const [exportErro, setExportErro] = useState<string | null>(null);
    const [comprovantePreviewUrl, setComprovantePreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;
        const carregar = async () => {
            try {
                setLoading(true);
                const dados = await listarInscricoes();
                if (ativo) {
                    setInscricoes(dados);
                }
            } catch (error) {
                console.error("[AdminDashboard] erro ao carregar inscrições", error);
                if (ativo) {
                    setErro("Não foi possível carregar as inscrições. Tente novamente.");
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        };
        void carregar();
        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        setSelecionados((prev) =>
            prev.filter((id) => inscricoes.some((inscricao) => inscricao.id === id)),
        );
    }, [inscricoes]);

    useEffect(() => {
        const comprovante = formData?.comprovantePagamento;
        if (!comprovante) {
            setComprovantePreviewUrl(null);
            return undefined;
        }
        if (comprovante.url) {
            setComprovantePreviewUrl(comprovante.url);
            return undefined;
        }
        if (!comprovante.conteudoBase64) {
            setComprovantePreviewUrl(null);
            return undefined;
        }
        const url = criarUrlBase64(comprovante.conteudoBase64, comprovante.mimeType);
        if (!url) {
            setComprovantePreviewUrl(null);
            return undefined;
        }
        setComprovantePreviewUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [formData?.comprovantePagamento]);

    const handleLogout = async () => {
        setLogoutErro(null);
        try {
            setLogoutCarregando(true);
            await sair();
        } catch (error) {
            console.error("[AdminDashboard] falha ao encerrar sessão", error);
            setLogoutErro("Não foi possível encerrar a sessão. Tente novamente.");
        } finally {
            setLogoutCarregando(false);
        }
    };

    const handleIrParaHome = () => {
        window.location.href = "/";
    };

    const handleToggleFaixa = (valor: FaixaEtaria) => {
        setFaixasSelecionadas((prev) =>
            prev.includes(valor) ? prev.filter((opcao) => opcao !== valor) : [...prev, valor],
        );
    };

    const handleOrdenacao = (key: string, direction: "asc" | "desc") => {
        setOrdenacao((prev) => {
            if (prev?.key === key && prev.direction === direction) {
                return null;
            }
            return {key, direction};
        });
    };

    const abrirEdicao = (inscricao: InscricaoRegistrada) => {
        setEditando(inscricao);
        setFormData(JSON.parse(JSON.stringify(inscricao)) as InscricaoRegistrada);
        setSalvarErro(null);
    };

    const fecharEdicao = () => {
        setEditando(null);
        setFormData(null);
        setSalvarErro(null);
        setSalvando(false);
    };

    const atualizarCampo = <K extends keyof InscricaoRegistrada>(
        campo: K,
        transform?: (valor: string) => InscricaoRegistrada[K],
    ) => (valor: string) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const novoValor = transform ? transform(valor) : (valor as InscricaoRegistrada[K]);
            return {...prev, [campo]: novoValor};
        });
    };

    const atualizarCampoEvento = <K extends keyof InscricaoRegistrada>(
        campo: K,
        transform?: (valor: string) => InscricaoRegistrada[K],
    ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        atualizarCampo(campo, transform)(event.target.value);
    };

    const atualizarResponsavel = (campo: "nome" | "contato") => (event: ChangeEvent<HTMLInputElement>) => {
        const valor = event.target.value;
        setFormData((prev) => {
            if (!prev) return prev;
            const atual = prev.responsavelLegal ?? {nome: "", contato: ""};
            return {...prev, responsavelLegal: {...atual, [campo]: valor}};
        });
    };

    const atualizarContatoEmergencia =
        (campo: "nome" | "parentesco" | "contato") => (event: ChangeEvent<HTMLInputElement>) => {
            const valor = event.target.value;
            setFormData((prev) => {
                if (!prev) return prev;
                const atual = prev.contatoEmergencia ?? {nome: "", parentesco: "", contato: ""};
                return {...prev, contatoEmergencia: {...atual, [campo]: valor}};
            });
        };

    const atualizarBooleano = (campo: "participouDeRetiro" | "consentimentoImagem" | "consentimentoDados") =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const {checked} = event.target;
            setFormData((prev) => (prev ? {...prev, [campo]: checked} : prev));
        };

    const atualizarComprovanteCampo =
        (campo: keyof ComprovantePagamentoDto) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const valor = event.target.value;
            setFormData((prev) => {
                if (!prev) return prev;
                const atual = prev.comprovantePagamento ?? {
                    nomeArquivo: "",
                    url: "",
                    caminhoStorage: "",
                    enviadoEm: "",
                    mimeType: "application/octet-stream",
                };
                return {
                    ...prev,
                    comprovantePagamento: {...atual, [campo]: valor},
                };
            });
        };

    const removerComprovanteAtual = () => {
        setFormData((prev) => (prev ? {...prev, comprovantePagamento: null} : prev));
    };

    const normalizarObjetoOpcional = <T extends Record<string, unknown>>(objeto: T | null | undefined): T | null => {
        if (!objeto) return null;
        const valores = Object.values(objeto).map((valor) =>
            typeof valor === "string" ? valor.trim() : valor,
        );
        const todosVazios = valores.every((valor) => valor === "" || valor === null || typeof valor === "undefined");
        if (todosVazios) {
            return null;
        }
        return objeto;
    };

    const normalizarComprovantePagamento = (
        comprovante: ComprovantePagamentoDto | null | undefined,
    ): ComprovantePagamentoDto | null => {
        if (!comprovante) {
            return null;
        }
        const nomeArquivo = comprovante.nomeArquivo?.trim() ?? "";
        const url = comprovante.url?.trim() ?? "";
        const caminhoStorage =
            comprovante.caminhoStorage?.trim() ??
            (url ? extrairPathDaUrl(url) ?? "" : "");
        const conteudoBase64 = comprovante.conteudoBase64?.trim() ?? "";
        const enviadoEm = comprovante.enviadoEm?.trim() ?? "";
        const mimeType = comprovante.mimeType?.trim() ?? "application/octet-stream";
        if (!nomeArquivo && !url && !conteudoBase64) {
            return null;
        }
        return {
            nomeArquivo,
            url: url || undefined,
            caminhoStorage: caminhoStorage || undefined,
            conteudoBase64: conteudoBase64 || undefined,
            enviadoEm: enviadoEm || undefined,
            mimeType,
        };
    };

    const handleSalvar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData) return;
        setSalvarErro(null);
        setSalvando(true);
        try {
            const contatoEmergencia = formData.contatoEmergencia
                ? {
                      nome: formData.contatoEmergencia.nome?.trim() ?? "",
                      parentesco: formData.contatoEmergencia.parentesco?.trim() ?? "",
                      contato: formData.contatoEmergencia.contato?.trim() ?? "",
                  }
                : {nome: "", parentesco: "", contato: ""};
            const comprovantePagamento = normalizarComprovantePagamento(formData.comprovantePagamento);
            const payload: InscricaoRegistrada = {
                ...formData,
                idade: Number.isFinite(Number(formData.idade)) ? Number(formData.idade) : 0,
                responsavelLegal: normalizarObjetoOpcional(
                    formData.responsavelLegal
                        ? {
                              nome: formData.responsavelLegal.nome?.trim() ?? "",
                              contato: formData.responsavelLegal.contato?.trim() ?? "",
                          }
                        : null,
                ),
                contatoEmergencia,
                comprovantePagamento,
            };
            await atualizarInscricao(payload);
            setInscricoes((prev) =>
                prev.map((inscricao) => (inscricao.id === payload.id ? {...payload} : inscricao)),
            );
            fecharEdicao();
        } catch (error) {
            console.error("[AdminDashboard] falha ao atualizar inscrição", error);
            setSalvarErro("Não foi possível salvar as alterações. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    const inscricoesProcessadas = useMemo(() => {
        const selecionarMenores = faixasSelecionadas.includes("menores");
        const selecionarMaiores = faixasSelecionadas.includes("maiores");
        const filtradas = inscricoes.filter((inscricao) => {
            const idade = inscricao.idade;
            if (selecionarMenores && selecionarMaiores) return true;
            if (!selecionarMenores && !selecionarMaiores) return false;
            if (selecionarMenores) {
                return ehMenor(idade);
            }
            return !ehMenor(idade);
        });
        if (!ordenacao) {
            return filtradas;
        }
        const {key, direction} = ordenacao;
        return [...filtradas].sort((a, b) => {
            const comparacao = compararColuna(a, b, key);
            return direction === "asc" ? comparacao : -comparacao;
        });
    }, [inscricoes, faixasSelecionadas, ordenacao]);
    const idsVisiveis = useMemo(
        () => inscricoesProcessadas.map((inscricao) => inscricao.id),
        [inscricoesProcessadas],
    );
    const todosVisiveisSelecionados =
        idsVisiveis.length > 0 && idsVisiveis.every((id) => selecionados.includes(id));
    const temSelecaoVisivel = idsVisiveis.some((id) => selecionados.includes(id));
    const temSelecao = selecionados.length > 0;
    const totalColunas = COLUNAS.length + 3;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !todosVisiveisSelecionados && temSelecaoVisivel;
        }
    }, [temSelecaoVisivel, todosVisiveisSelecionados]);

    const handleToggleSelecao = (id: string) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    };

    const handleSelecionarTodosVisiveis = () => {
        if (idsVisiveis.length === 0) {
            return;
        }
        if (todosVisiveisSelecionados) {
            setSelecionados((prev) => prev.filter((id) => !idsVisiveis.includes(id)));
            return;
        }
        setSelecionados((prev) => {
            const conjunto = new Set(prev);
            idsVisiveis.forEach((id) => conjunto.add(id));
            return Array.from(conjunto);
        });
    };

    const handleExcluirSelecionadas = async () => {
        if (selecionados.length === 0) {
            return;
        }
        const mensagem =
            selecionados.length === 1
                ? "Deseja excluir a inscrição selecionada? Esta ação não pode ser desfeita."
                : `Deseja excluir ${selecionados.length} inscrições selecionadas? Esta ação não pode ser desfeita.`;
        if (!window.confirm(mensagem)) {
            return;
        }
        try {
            setExcluindo(true);
            setExcluirErro(null);
            await removerInscricoes(selecionados);
            setInscricoes((prev) =>
                prev.filter((inscricao) => !selecionados.includes(inscricao.id)),
            );
            setSelecionados([]);
        } catch (error) {
            console.error("[AdminDashboard] falha ao excluir inscrições", error);
            setExcluirErro("Não foi possível excluir as inscrições selecionadas. Tente novamente.");
        } finally {
            setExcluindo(false);
        }
    };

    const handleExportarCsv = () => {
        if (inscricoesProcessadas.length === 0) {
            setExportErro("Não há inscrições para exportar.");
            return;
        }
        try {
            setExportErro(null);
            setExportando(true);
            const conteudo = gerarCsv(inscricoesProcessadas);
            const blob = new Blob(["\ufeff", conteudo], {type: "text/csv;charset=utf-8;"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const hoje = new Date();
            const dataFormatada = hoje
                .toLocaleDateString("pt-BR")
                .replace(/\//g, "-")
                .replace(/[^0-9-]/g, "");
            link.download = `inscricoes-kasa-${dataFormatada}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("[AdminDashboard] falha ao exportar inscrições", error);
            setExportErro("Não foi possível exportar a planilha. Tente novamente.");
        } finally {
            setExportando(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground px-4 py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl border bg-white shadow flex items-center justify-center">
                            <img src="/assets/img/logo.png" alt="Movimento Kairós" className="h-12 w-12 object-contain"/>
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="flex items-center gap-2 text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                <LayoutList className="size-4"/> Painel Administrativo
                            </h1>
                            <p className="text-sm text-muted-foreground/80">Gestão das inscrições do Retiro KASA</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleIrParaHome}
                                className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/10 transition"
                            >
                                Ir para o site
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center rounded-xl bg-red-600 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                disabled={logoutCarregando}
                            >
                                {logoutCarregando ? "Saindo..." : "Encerrar sessão"}
                            </button>
                        </div>
                    </div>
                </header>

                {logoutErro ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                        {logoutErro}
                    </div>
                ) : null}

                <section className="bg-card text-card-foreground border rounded-2xl p-0 shadow-sm overflow-hidden">
                    <div className="flex flex-col gap-4 border-b px-6 py-4 text-sm lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Filtrar por faixa etária
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {FAIXA_ETARIA_OPCOES.map((opcao) => {
                                    const ativo = faixasSelecionadas.includes(opcao.valor);
                                    return (
                                        <button
                                            key={opcao.valor}
                                            type="button"
                                            onClick={() => handleToggleFaixa(opcao.valor)}
                                            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                                                ativo
                                                    ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                    : "bg-accent text-muted-foreground hover:text-foreground hover:bg-accent"
                                            }`}
                                        >
                                            {opcao.rotulo}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                                {temSelecao
                                    ? `${selecionados.length} selecionada(s)`
                                    : "Selecione inscrições para excluir"}
                            </span>
                            <button
                                type="button"
                                onClick={handleExcluirSelecionadas}
                                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                disabled={!temSelecao || excluindo}
                            >
                                {excluindo ? "Excluindo..." : "Excluir selecionadas"}
                            </button>
                            <button
                                type="button"
                                onClick={handleExportarCsv}
                                className="inline-flex items-center justify-center rounded-xl border border-primary/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                disabled={exportando}
                            >
                                {exportando ? "Gerando planilha..." : "Exportar planilha"}
                            </button>
                        </div>
                    </div>
                    {excluirErro ? (
                        <div className="border-b border-red-500/30 bg-red-500/10 px-6 py-3 text-sm text-red-500">
                            {excluirErro}
                        </div>
                    ) : null}
                    {exportErro ? (
                        <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm text-amber-700">
                            {exportErro}
                        </div>
                    ) : null}

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            className="size-4 accent-primary"
                                            onChange={handleSelecionarTodosVisiveis}
                                            checked={todosVisiveisSelecionados && idsVisiveis.length > 0}
                                            aria-label="Selecionar todas as inscrições listadas"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Ações</th>
                                    {COLUNAS.map((coluna) => {
                                            const ativaAsc = ordenacao?.key === coluna.key && ordenacao.direction === "asc";
                                            const ativaDesc = ordenacao?.key === coluna.key && ordenacao.direction === "desc";
                                            return (
                                                <th key={coluna.key} className="px-4 py-3 text-left align-top whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                    <span>{coluna.label}</span>
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOrdenacao(coluna.key, "asc")}
                                                            className={`inline-flex size-6 items-center justify-center rounded-md border border-transparent hover:bg-muted transition ${
                                                                ativaAsc ? "text-primary" : ""
                                                            }`}
                                                            aria-label={`Ordenar ${coluna.label} ascendente`}
                                                        >
                                                            <ChevronUp className="size-4"/>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOrdenacao(coluna.key, "desc")}
                                                            className={`inline-flex size-6 items-center justify-center rounded-md border border-transparent hover:bg-muted transition ${
                                                                ativaDesc ? "text-primary" : ""
                                                            }`}
                                                            aria-label={`Ordenar ${coluna.label} descendente`}
                                                        >
                                                            <ChevronDown className="size-4"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={totalColunas} className="px-4 py-6 text-center text-muted-foreground">
                                            Carregando inscrições...
                                        </td>
                                    </tr>
                                ) : erro ? (
                                    <tr>
                                        <td colSpan={totalColunas} className="px-4 py-6 text-center text-red-500">
                                            {erro}
                                        </td>
                                    </tr>
                                ) : inscricoesProcessadas.length === 0 ? (
                                    <tr>
                                        <td colSpan={totalColunas} className="px-4 py-6 text-center text-muted-foreground">
                                            Nenhuma inscrição encontrada.
                                        </td>
                                    </tr>
                                ) : (
                                    inscricoesProcessadas.map((inscricao, index) => (
                                        <tr
                                            key={inscricao.id}
                                            className="border-t hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    type="checkbox"
                                                    className="size-4 accent-primary"
                                                    checked={selecionados.includes(inscricao.id)}
                                                    onChange={() => handleToggleSelecao(inscricao.id)}
                                                    disabled={excluindo}
                                                    aria-label={`Selecionar inscrição ${
                                                        inscricao.nomeCompleto ?? inscricao.id
                                                    }`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <button
                                                    type="button"
                                                    onClick={() => abrirEdicao(inscricao)}
                                                    className="rounded-lg border border-primary/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/10 transition"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                            {COLUNAS.map((coluna) => {
                                                const valor = coluna.accessor(inscricao);
                                                const isComprovante = coluna.key === "comprovantePagamento";
                                                return (
                                                    <td
                                                        key={coluna.key}
                                                        className="px-4 py-3 align-top whitespace-pre-wrap"
                                                    >
                                                        {isComprovante ? (
                                                            <ComprovanteCell
                                                                comprovante={inscricao.comprovantePagamento}
                                                                fallback={valor}
                                                            />
                                                        ) : (
                                                            valor
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            {formData ? (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black px-4 py-10">
                    <div className="w-full max-w-3xl rounded-2xl bg-card text-card-foreground shadow-2xl">
                        <form onSubmit={handleSalvar} className="max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 flex items-center justify-between gap-4 border-b bg-card px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Editar inscrição
                                        {editando?.nomeCompleto ? ` • ${editando.nomeCompleto}` : ""}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Ajuste as informações necessárias e salve para atualizar o registro.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={fecharEdicao}
                                    className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                                >
                                    Fechar
                                </button>
                            </div>

                            <div className="space-y-6 px-6 py-6">
                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Dados pessoais
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Nome completo
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.nomeCompleto ?? ""}
                                                onChange={atualizarCampoEvento("nomeCompleto")}
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Data de nascimento
                                            <input
                                                type="date"
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.dataNascimento ?? ""}
                                                onChange={atualizarCampoEvento("dataNascimento")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Idade
                                            <input
                                                type="number"
                                                min={0}
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.idade?.toString() ?? ""}
                                                onChange={atualizarCampoEvento("idade", (valor) =>
                                                    Number.isFinite(Number(valor)) ? Number(valor) : 0,
                                                )}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Documento (RG/CPF)
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.documentoIdentificacao ?? ""}
                                                onChange={atualizarCampoEvento("documentoIdentificacao")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Contato individual
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.contatoIndividual ?? ""}
                                                onChange={atualizarCampoEvento("contatoIndividual")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Endereço
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.endereco ?? ""}
                                                onChange={atualizarCampoEvento("endereco")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Tamanho da camisa
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.tamanhoCamisa ?? ""}
                                                onChange={atualizarCampoEvento("tamanhoCamisa")}
                                            />
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border border-black/20 text-primary focus:ring-primary/30"
                                                checked={Boolean(formData.participouDeRetiro)}
                                                onChange={atualizarBooleano("participouDeRetiro")}
                                            />
                                            Já participou de retiro
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Responsável legal
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Nome
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.responsavelLegal?.nome ?? ""}
                                                onChange={atualizarResponsavel("nome")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Contato
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.responsavelLegal?.contato ?? ""}
                                                onChange={atualizarResponsavel("contato")}
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Contato de emergência
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Nome
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.contatoEmergencia?.nome ?? ""}
                                                onChange={atualizarContatoEmergencia("nome")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Parentesco
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.contatoEmergencia?.parentesco ?? ""}
                                                onChange={atualizarContatoEmergencia("parentesco")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Contato
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.contatoEmergencia?.contato ?? ""}
                                                onChange={atualizarContatoEmergencia("contato")}
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Detalhes adicionais
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Comunidade de origem
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.comunidadeOrigem ?? ""}
                                                onChange={atualizarCampoEvento("comunidadeOrigem")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Dons e habilidades
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.donsHabilidades ?? ""}
                                                onChange={atualizarCampoEvento("donsHabilidades")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:col-span-2">
                                            Alergias / intolerâncias
                                            <textarea
                                                className="min-h-[72px] rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.alergiasIntolerancias ?? ""}
                                                onChange={atualizarCampoEvento("alergiasIntolerancias")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:col-span-2">
                                            Necessidades especiais
                                            <textarea
                                                className="min-h-[72px] rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.necessidadesEspeciais ?? ""}
                                                onChange={atualizarCampoEvento("necessidadesEspeciais")}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Forma de pagamento
                                            <select
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.formaPagamento ?? "PIX"}
                                                onChange={atualizarCampoEvento("formaPagamento", (valor) => valor as InscricaoRegistrada["formaPagamento"])}
                                            >
                                                {FORMA_PAGAMENTO_OPCOES.map((opcao) => (
                                                    <option key={opcao.valor} value={opcao.valor}>
                                                        {opcao.rotulo}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            <span>Comprovante de pagamento</span>
                                            {comprovantePreviewUrl ? (
                                                <a
                                                    href={comprovantePreviewUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary underline text-[11px]"
                                                >
                                                    Abrir comprovante atual
                                                </a>
                                            ) : (
                                                <span className="text-[11px] text-muted-foreground">
                                                    Nenhum comprovante enviado.
                                                </span>
                                            )}
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.comprovantePagamento?.nomeArquivo ?? ""}
                                                onChange={atualizarComprovanteCampo("nomeArquivo")}
                                                placeholder="Nome original do arquivo"
                                            />
                                            <input
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.comprovantePagamento?.url ?? ""}
                                                onChange={atualizarComprovanteCampo("url")}
                                                placeholder="URL público do comprovante"
                                            />
                                            <div className="flex flex-wrap gap-2 text-[11px] normal-case">
                            <span className="text-muted-foreground">
                                Caminho: {formData.comprovantePagamento?.caminhoStorage || "-"}
                            </span>
                                                <span className="text-muted-foreground">
                                Enviado em: {formData.comprovantePagamento?.enviadoEm || "-"}
                            </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removerComprovanteAtual}
                                                className="self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500 hover:bg-red-50"
                                                disabled={!formData.comprovantePagamento}
                                            >
                                                Remover comprovante
                                            </button>
                                        </div>
                                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:col-span-2">
                                            Observações
                                            <textarea
                                                className="min-h-[72px] rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                                value={formData.observacoes ?? ""}
                                                onChange={atualizarCampoEvento("observacoes")}
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Consentimentos
                                    </h3>
                                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            className="size-4 rounded border border-black/20 text-primary focus:ring-primary/30"
                                            checked={Boolean(formData.consentimentoImagem)}
                                            onChange={atualizarBooleano("consentimentoImagem")}
                                        />
                                        Autorização de imagem
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            className="size-4 rounded border border-black/20 text-primary focus:ring-primary/30"
                                            checked={Boolean(formData.consentimentoDados)}
                                            onChange={atualizarBooleano("consentimentoDados")}
                                        />
                                        Autorização de dados
                                    </label>
                                </section>

                                {salvarErro ? (
                                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                                        {salvarErro}
                                    </div>
                                ) : null}

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={fecharEdicao}
                                        className="rounded-lg border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                                        disabled={salvando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={salvando}
                                    >
                                        {salvando ? "Salvando..." : "Salvar alterações"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
