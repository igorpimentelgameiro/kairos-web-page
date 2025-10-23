import {useEffect, useMemo, useState} from "react";
import type {ChangeEvent} from "react";
import type {InscricaoRegistrada} from "@dominio/servicos/inscricaoFirebaseServico";
import {listarInscricoes} from "@dominio/servicos/inscricaoFirebaseServico";

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
        accessor: (i) => i.comprovantePagamento ?? "-",
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

type Filtros = Record<string, string>;

const inicializarFiltros = (): Filtros =>
    COLUNAS.reduce<Filtros>((acc, coluna) => {
        acc[coluna.key] = "";
        return acc;
    }, {});

export default function AdminDashboard() {
    const [inscricoes, setInscricoes] = useState<InscricaoRegistrada[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [filtros, setFiltros] = useState<Filtros>(() => inicializarFiltros());

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

    const handleFiltroChange =
        (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
            const valor = event.target.value;
            setFiltros((prev) => ({...prev, [key]: valor}));
        };

    const inscricoesFiltradas = useMemo(() => {
        const termos = Object.entries(filtros)
            .filter(([, valor]) => valor.trim() !== "")
            .map(([key, valor]) => ({
                key,
                termo: valor.trim().toLowerCase(),
            }));
        if (termos.length === 0) return inscricoes;
        return inscricoes.filter((inscricao) =>
            termos.every(({key, termo}) => {
                const coluna = COLUNAS.find((col) => col.key === key);
                if (!coluna) return true;
                const valor = coluna.accessor(inscricao).toLowerCase();
                return valor.includes(termo);
            }),
        );
    }, [inscricoes, filtros]);

    return (
        <div className="min-h-screen bg-background text-foreground px-6 py-10">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Painel Administrativo</h1>
                    <p className="text-sm text-muted-foreground">
                        Consulte e filtre as inscrições enviadas pelo formulário do Retiro KASA.
                    </p>
                </header>

                <section className="bg-card text-card-foreground border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                        Filtros
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {COLUNAS.map((coluna) => (
                            <div key={coluna.key} className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-muted-foreground">
                                    {coluna.label}
                                </label>
                                <input
                                    className="border rounded-xl px-3 py-2 text-sm bg-white text-neutral-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 dark:bg-neutral-900 dark:text-white dark:placeholder:text-slate-400 dark:border-neutral-700"
                                    placeholder={`Filtrar ${coluna.label.toLowerCase()}`}
                                    value={filtros[coluna.key]}
                                    onChange={handleFiltroChange(coluna.key)}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-card text-card-foreground border border-black/5 dark:border-white/10 rounded-2xl p-0 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 text-left">#</th>
                                    {COLUNAS.map((coluna) => (
                                        <th key={coluna.key} className="px-4 py-3 text-left whitespace-nowrap">
                                            {coluna.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={COLUNAS.length + 1} className="px-4 py-6 text-center text-muted-foreground">
                                            Carregando inscrições...
                                        </td>
                                    </tr>
                                ) : erro ? (
                                    <tr>
                                        <td colSpan={COLUNAS.length + 1} className="px-4 py-6 text-center text-red-500">
                                            {erro}
                                        </td>
                                    </tr>
                                ) : inscricoesFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={COLUNAS.length + 1} className="px-4 py-6 text-center text-muted-foreground">
                                            Nenhuma inscrição encontrada.
                                        </td>
                                    </tr>
                                ) : (
                                    inscricoesFiltradas.map((inscricao, index) => (
                                        <tr
                                            key={inscricao.id}
                                            className="border-t border-black/5 dark:border-white/10 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                                                {index + 1}
                                            </td>
                                            {COLUNAS.map((coluna) => (
                                                <td key={coluna.key} className="px-4 py-3 align-top whitespace-pre-wrap">
                                                    {coluna.accessor(inscricao)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
