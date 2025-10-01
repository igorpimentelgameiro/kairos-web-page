import React, {useMemo, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
    Heart,
    Home,
    Users,
    Sparkles,
    HandHeart,
    Phone,
    Mail,
    MapPin,
    CalendarClock,
    ChevronRight,
    QrCode,
    Sun,
    Moon
} from "lucide-react";

// ------------------------------------------------------------
// Kairós 2.0 — Protótipo em React (SPA)
// - Único arquivo, sem servidor: perfeito para preview
// - Tailwind + framer-motion + lucide-react (disponíveis no ambiente)
// - Navegação por estado (tabs) simulando páginas
// ------------------------------------------------------------

const PAGES = {
    HOME: "Início",
    QUEM_SOMOS: "Quem Somos",
    KASA: "Retiro KASA",
    BENFEITOR: "Seja Benfeitor",
    CONTATO: "Contato",
};

const Section = ({title, subtitle, children}: { title: string; subtitle?: string; children?: React.ReactNode }) => (
    <section className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-2 text-muted-foreground max-w-3xl">{subtitle}</p>}
            <div className="mt-6">{children}</div>
        </motion.div>
    </section>
);

const Card = ({children, className = ""}: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-2xl shadow-sm border bg-card text-card-foreground ${className}`}>{children}</div>
);

const Pill = ({children}: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm">
    {children}
  </span>
);

function useDarkMode() {
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    React.useEffect(() => {
        const root = document.documentElement;
        if (enabled) root.classList.add("dark");
        else root.classList.remove("dark");
    }, [enabled]);

    return {enabled, setEnabled};
}

const Hero = ({onCTA}: { onCTA: () => void }) => (
    <div className="relative">
        <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-white to-transparent dark:from-amber-950/30 dark:via-background dark:to-transparent"/>
        <Section title="Kairós — o tempo de Deus"
                 subtitle="Uma família em Cristo vivendo a presença do Espírito Santo, gerando frutos e servindo com amor.">
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                        <Pill><Sparkles className="size-3.5"/> Carisma</Pill>
                        <Pill><Heart className="size-3.5"/> Missão</Pill>
                        <Pill><Users className="size-3.5"/> Comunidade</Pill>
                    </div>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Somos um movimento pertencente à Basílica Santuário de Nossa Senhora de Nazaré (Belém/PA),
                        vivendo e anunciando o <em>Kairós</em>: o tempo da Graça. Nosso chamado é conduzir pessoas a uma
                        experiência real, profunda e transformadora com Deus.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={onCTA}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2">
                            Participar do KASA <ChevronRight className="size-4"/>
                        </button>
                        <a href="#benfeitor"
                           className="px-4 py-2 rounded-xl border font-semibold flex items-center gap-2">
                            Seja um Benfeitor <HandHeart className="size-4"/>
                        </a>
                    </div>
                </div>
                <Card className="overflow-hidden">
                    <div className="aspect-[16/10] w-full bg-cover bg-center"
                         style={{backgroundImage: "url(https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400&auto=format&fit=crop)"}}/>
                    <div className="p-5">
                        <div className="font-semibold">Família em Cristo</div>
                        <p className="text-sm text-muted-foreground">O Kairós é mais que amizade: é unidade, partilha e
                            envio.</p>
                    </div>
                </Card>
            </div>
        </Section>
    </div>
);

const LinhaDoTempo = () => (
    <Section title="Nossa História" subtitle="Fundado em 11 de março de 2023, caminhamos na escuta e no serviço.">
        <div className="relative pl-6 border-l">
            {[
                {t: "Mar/2023", d: "Fundação do Movimento Kairós."},
                {t: "2024", d: "Primeiras edições do Retiro KASA."},
                {t: "2025", d: "Expansão das frentes de serviço e acolhimento."},
            ].map((i, idx) => (
                <div key={idx} className="mb-6">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary"/>
                        <span className="text-sm font-semibold">{i.t}</span>
                    </div>
                    <p className="ml-4 mt-2 text-muted-foreground">{i.d}</p>
                </div>
            ))}
        </div>
    </Section>
);

const QuemSomos = () => (
    <>
        <Section title="Quem Somos" subtitle="Carisma • Missão • Vida fraterna">
            <div className="grid md:grid-cols-3 gap-4">
                {[{
                    title: "Carisma",
                    desc: "Viver o tempo de Deus: do Chronos ao Kairós, uma resposta concreta ao amor que transforma.",
                    icon: Sparkles,
                }, {
                    title: "Missão",
                    desc: "Ser instrumento do Espírito Santo por meio do acolhimento, escuta e testemunho da fé.",
                    icon: Heart,
                }, {
                    title: "Comunidade",
                    desc: "Mais que um grupo: uma família em Cristo, unida na partilha e no serviço.",
                    icon: Users,
                }].map((c, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex items-center gap-3">
                            <c.icon className="size-6"/>
                            <div className="text-lg font-semibold">{c.title}</div>
                        </div>
                        <p className="mt-3 text-muted-foreground">{c.desc}</p>
                    </Card>
                ))}
            </div>
        </Section>
        <LinhaDoTempo/>
    </>
);

const KASA = () => (
    <>
        <Section title="Retiro KASA" subtitle="Um fim de semana de encontro, cura e renovação da fé.">
            <div className="grid md:grid-cols-3 gap-4">
                {[{
                    tag: "Animação",
                    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop",
                    text: "Muito mais que um encontro: é um chamado à transformação!",
                }, {
                    tag: "Gerar Frutos",
                    img: "https://images.unsplash.com/photo-1455787214952-1404e3f29f12?q=80&w=1400&auto=format&fit=crop",
                    text: "Os frutos nascem de uma vida de oração, serviço e amor ao próximo.",
                }, {
                    tag: "Família em Cristo",
                    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop",
                    text: "Vivemos a fraternidade com alegria, partilha e unidade.",
                }].map((k, i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="aspect-[4/3] bg-cover bg-center" style={{backgroundImage: `url(${k.img})`}}/>
                        <div className="p-5">
                            <Pill><Sparkles className="size-3.5"/> {k.tag}</Pill>
                            <p className="mt-3 text-muted-foreground">{k.text}</p>
                            <button
                                className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold">
                                Saber mais <ChevronRight className="size-4"/>
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </Section>
        <Section title="Próximas datas" subtitle="Participe da próxima edição do KASA.">
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    {quando: "12–14 Set 2025", onde: "Belém/PA", status: "Inscrições Abertas"},
                    {quando: "07–09 Nov 2025", onde: "Belém/PA", status: "Em breve"},
                    {quando: "Mar 2026", onde: "A definir", status: "Planejamento"},
                ].map((e, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-lg font-semibold flex items-center gap-2"><CalendarClock
                                    className="size-5"/> {e.quando}</div>
                                <div className="text-muted-foreground flex items-center gap-2"><MapPin
                                    className="size-4"/> {e.onde}</div>
                            </div>
                            <Pill>{e.status}</Pill>
                        </div>
                        <button
                            className="mt-4 w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold">Quero
                            participar
                        </button>
                    </Card>
                ))}
            </div>
        </Section>
    </>
);

const Benfeitor = () => (
    <Section title="Seja um Benfeitor"
             subtitle="Sua doação ajuda a sustentar as frentes de evangelização e acolhimento.">
        <div className="grid md:grid-cols-2 gap-6 items-start">
            <Card className="p-6">
                <div className="flex items-center gap-3">
                    <HandHeart className="size-6"/>
                    <div className="text-lg font-semibold">Doação via Pix</div>
                </div>
                <p className="mt-3 text-muted-foreground">Use a chave Pix abaixo para contribuir com qualquer valor.</p>
                <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 items-center">
                    <QrCode className="size-14"/>
                    <div>
                        <div className="text-sm text-muted-foreground">Chave Pix</div>
                        <div className="font-mono text-base md:text-lg select-all">movimentokairos23@gmail.com</div>
                    </div>
                </div>
                <button
                    className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold">
                    Copiar chave Pix <ChevronRight className="size-4"/>
                </button>
            </Card>
            <Card className="p-6">
                <div className="text-lg font-semibold">Transparência</div>
                <p className="mt-3 text-muted-foreground">Publicaremos relatórios de prestação de contas a cada edição
                    do KASA e atividades do movimento.</p>
                <ul className="mt-4 list-disc pl-5 text-muted-foreground space-y-1">
                    <li>Sem fins lucrativos e sem apoio financeiro externo.</li>
                    <li>Colaboração de pessoas comprometidas com causas sociais.</li>
                    <li>Uso responsável dos recursos e prioridades missionárias.</li>
                </ul>
            </Card>
        </div>
    </Section>
);

const Contato = () => (
    <Section title="Fale Conosco" subtitle="Estamos próximos de você.">
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
                <div className="text-lg font-semibold">Endereço & Contatos</div>
                <div className="mt-4 space-y-2 text-muted-foreground">
                    <div className="flex items-start gap-3"><MapPin className="size-5 mt-0.5"/> Av. Conselheiro Furtado,
                        1571 - Nazaré, Belém - PA • Comunidade Santa Bernadette
                    </div>
                    <div className="flex items-center gap-3"><Mail className="size-5"/> movimentokairos23@gmail.com
                    </div>
                    <div className="flex items-center gap-3"><Phone className="size-5"/> +55 (91) 98615-3379</div>
                </div>
            </Card>
            <Card className="p-6">
                <div className="text-lg font-semibold">Envie uma mensagem</div>
                <form className="mt-4 grid gap-3">
                    <input className="border rounded-xl px-3 py-2" placeholder="Seu nome"/>
                    <input className="border rounded-xl px-3 py-2" placeholder="Seu e-mail"/>
                    <textarea className="border rounded-xl px-3 py-2 min-h-28" placeholder="Escreva sua mensagem"/>
                    <button type="button"
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold">Enviar
                    </button>
                </form>
            </Card>
        </div>
    </Section>
);

export default function App() {
    const [page, setPage] = useState<string>("HOME");
    const {enabled: dark, setEnabled} = useDarkMode();

    const CurrentPage = useMemo(() => {
        switch (page) {
            case "HOME":
                return (
                    <>
                        <Hero onCTA={() => setPage("KASA")}/>
                        <QuemSomos/>
                    </>
                );
            case "QUEM_SOMOS":
                return <QuemSomos/>;
            case "KASA":
                return <KASA/>;
            case "BENFEITOR":
                return <Benfeitor/>;
            case "CONTATO":
                return <Contato/>;
            default:
                return null;
        }
    }, [page]);

    // ====== LOGO DO PROJETO (usa /public/assets/logo.* se existir) ======
    const [logoOk, setLogoOk] = useState(true);
    const logoSrc = "/assets/logo.png"; // altere para logo.svg/jpg se for o seu caso

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header
                className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {logoOk ? (
                            <img
                                src={logoSrc}
                                alt="Movimento Kairós"
                                className="h-9 w-9 rounded-xl object-cover"
                                onError={() => setLogoOk(false)}
                            />
                        ) : (
                            <div
                                className="size-9 rounded-xl bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500"/>
                        )}
                        <div className="leading-tight">
                            <div className="font-extrabold tracking-tight">Movimento Kairós</div>
                            <div className="text-xs text-muted-foreground -mt-0.5">Viver o Tempo da Graça</div>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            {key: "HOME", label: PAGES.HOME, icon: Home},
                            {key: "QUEM_SOMOS", label: PAGES.QUEM_SOMOS, icon: Users},
                            {key: "KASA", label: PAGES.KASA, icon: Sparkles},
                            {key: "BENFEITOR", label: PAGES.BENFEITOR, icon: HandHeart},
                            {key: "CONTATO", label: PAGES.CONTATO, icon: Phone},
                        ].map(({key, label, icon: Icon}) => (
                            <button
                                key={key}
                                onClick={() => setPage(key)}
                                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition ${page === key ? "bg-accent text-accent-foreground" : ""}`}
                            >
                                <Icon className="size-4"/> {label}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setEnabled(!dark)} aria-label="Alternar tema"
                                className="p-2 rounded-xl border hover:bg-accent">
                            {dark ? <Sun className="size-5"/> : <Moon className="size-5"/>}
                        </button>
                    </div>
                </div>
                <div className="md:hidden border-t px-2 py-2 grid grid-cols-5 gap-2">
                    {["HOME", "QUEM_SOMOS", "KASA", "BENFEITOR", "CONTATO"].map((key) => (
                        <button
                            key={key}
                            onClick={() => setPage(key)}
                            className={`px-2 py-2 rounded-xl text-xs font-medium hover:bg-accent hover:text-accent-foreground ${page === key ? "bg-accent text-accent-foreground" : ""}`}
                        >
                            {PAGES[key as keyof typeof PAGES]}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.main key={page} initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}}
                             exit={{opacity: 0, y: -6}} transition={{duration: 0.25}}>
                    {/* ==== Hero com imagem local, se existir ==== */}
                    {page === "HOME" && (
                        <div className="relative">
                            <div
                                className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-white to-transparent dark:from-amber-950/30 dark:via-background dark:to-transparent"/>
                            <Section title="Kairós — o tempo de Deus"
                                     subtitle="Uma família em Cristo vivendo a presença do Espírito Santo, gerando frutos e servindo com amor.">
                                <div className="grid md:grid-cols-2 gap-6 items-center">
                                    <div className="space-y-5">
                                        <div className="flex flex-wrap gap-2">
                                            <Pill><Sparkles className="size-3.5"/> Carisma</Pill>
                                            <Pill><Heart className="size-3.5"/> Missão</Pill>
                                            <Pill><Users className="size-3.5"/> Comunidade</Pill>
                                        </div>
                                        <p className="text-lg leading-relaxed text-muted-foreground">
                                            Somos um movimento pertencente à Basílica Santuário de Nossa Senhora de
                                            Nazaré (Belém/PA),
                                            vivendo e anunciando o <em>Kairós</em>: o tempo da Graça. Nosso chamado é
                                            conduzir pessoas a uma
                                            experiência real, profunda e transformadora com Deus.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <button onClick={() => setPage("KASA")}
                                                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2">
                                                Participar do KASA <ChevronRight className="size-4"/>
                                            </button>
                                            <a href="#benfeitor" onClick={(e) => {
                                                e.preventDefault();
                                                setPage("BENFEITOR");
                                            }}
                                               className="px-4 py-2 rounded-xl border font-semibold flex items-center gap-2">
                                                Seja um Benfeitor <HandHeart className="size-4"/>
                                            </a>
                                        </div>
                                    </div>
                                    <Card className="overflow-hidden">
                                        {/* Tente carregar imagem local em /public/assets/hero.jpg; cai para Unsplash se não existir */}
                                        <div className="aspect-[16/10] w-full bg-cover bg-center"
                                             style={{backgroundImage: `url(/assets/hero.jpg), url(https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400&auto=format&fit=crop)`}}/>
                                        <div className="p-5">
                                            <div className="font-semibold">Família em Cristo</div>
                                            <p className="text-sm text-muted-foreground">O Kairós é mais que amizade: é
                                                unidade, partilha e envio.</p>
                                        </div>
                                    </Card>
                                </div>
                            </Section>
                        </div>
                    )}

                    {CurrentPage}
                </motion.main>
            </AnimatePresence>

            <footer className="mt-10 border-t">
                <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <div className="font-semibold">Movimento Kairós</div>
                        <p className="mt-2 text-muted-foreground">Copyright © {new Date().getFullYear()} • Belém, PA</p>
                    </div>
                    <div>
                        <div className="font-semibold">Contatos</div>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                            <li className="flex items-center gap-2"><Mail
                                className="size-4"/> movimentokairos23@gmail.com
                            </li>
                            <li className="flex items-center gap-2"><Phone className="size-4"/> +55 (91) 98615-3379</li>
                            <li className="flex items-center gap-2"><MapPin className="size-4"/> Av. Cons. Furtado, 1571
                                — Nazaré, Belém/PA
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold">Atalhos</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(PAGES).map(([k, v]) => (
                                <button key={k} onClick={() => setPage(k)}
                                        className="px-3 py-1.5 rounded-xl border hover:bg-accent hover:text-accent-foreground">
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <a
                href="#benfeitor"
                onClick={(e) => {
                    e.preventDefault();
                    setPage("BENFEITOR");
                }}
                className="fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2"
            >
                <HandHeart className="size-4"/> Apoiar
            </a>
        </div>
    );
}
