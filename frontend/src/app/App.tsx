import {useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Navbar from "@componente/Navbar";
import {NAVIGATION_PAGES, PAGE_LABELS, type PageKey} from "@componente/Navbar.types";
import Home from "@pagina/Home";
import QuemSomos from "@pagina/QuemSomos";
import Kasa from "@pagina/Kasa";
import Benfeitor from "@pagina/Benfeitor";
import Contato from "@pagina/Contato";
import InscricaoRetiroKasaIII from "@pagina/InscricaoRetiroKasaIII";
import {Github, HandHeart, Instagram, Linkedin, Mail, MapPin, Phone} from "lucide-react";
import useTheme from "@componente/hooks/useTheme";
import AdminLogin from "@pagina/AdminLogin";

export default function App() {
    const {temaAtual, definirTema, temasDisponiveis} = useTheme();
    const isAdminRoute =
        typeof window !== "undefined" &&
        window.location.pathname.replace(/\/+$/, "") === "/admin";

    if (isAdminRoute) {
        return (
            <div className="min-h-screen bg-background text-foreground" data-theme={temaAtual.nome}>
                <AdminLogin temaAtual={temaAtual} temas={temasDisponiveis} onTemaChange={definirTema}/>
            </div>
        );
    }

    const [page, setPage] = useState<PageKey>("HOME");

    const CurrentPage = useMemo(() => {
        switch (page) {
            case "HOME":
                return <Home onCTA={() => setPage("KASA")} goBenfeitor={() => setPage("BENFEITOR")}/>;
            case "QUEM_SOMOS":
                return <QuemSomos/>;
            case "KASA":
                return <Kasa onParticipar={() => setPage("INSCRICAO_KASA_III")}/>;
            case "BENFEITOR":
                return <Benfeitor/>;
            case "CONTATO":
                return <Contato/>;
            case "INSCRICAO_KASA_III":
                return <InscricaoRetiroKasaIII onVoltar={() => setPage("KASA")} />;
            default:
                return null;
        }
    }, [page]);

    return (
        <div className="min-h-screen bg-background text-foreground" data-theme={temaAtual.nome}>
            <Navbar
                current={page}
                onNavigate={setPage}
                logoSrc="/assets/img/logo.png"
                temaAtual={temaAtual}
                temas={temasDisponiveis}
                onTemaChange={definirTema}
            />

            <AnimatePresence mode="wait">
                <motion.main
                    key={page}
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -6}}
                    transition={{duration: 0.25}}
                >
                    {CurrentPage}
                </motion.main>
            </AnimatePresence>

            <footer className="mt-10 border-t">
                <div className="max-w-6xl mx-auto grid gap-8 px-4 py-10 text-sm md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <div className="font-semibold">Movimento Kairós</div>
                        <p className="text-muted-foreground">Viver o Tempo da Graça</p>
                    </div>
                    <div className="space-y-2">
                        <div className="font-semibold">Contatos</div>
                        <ul className="space-y-1 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="size-4"/> movimentokairos23@gmail.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-4"/> +55 (91) 98615-3379
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="size-4"/> Av. Cons. Furtado, 1571 — Nazaré, Belém/PA
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <div className="font-semibold">Atalhos</div>
                        <div className="flex flex-wrap gap-2">
                            {NAVIGATION_PAGES.map((k) => (
                                <button
                                    key={k}
                                    onClick={() => setPage(k)}
                                    className="px-3 py-1.5 rounded-xl border hover:bg-accent hover:text-accent-foreground"
                                >
                                    {PAGE_LABELS[k]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 text-muted-foreground">
                        <div className="font-semibold">Desenvolvido por Igor Pimentel Gameiro</div>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/igorpimentelgameiro"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub • Igor Pimentel Gameiro"
                                className="inline-flex items-center gap-2 hover:text-foreground transition"
                            >
                                <Github className="size-4"/> GitHub
                            </a>
                            <a
                                href="https://www.instagram.com/_igorpgameiro/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram • Igor Pimentel Gameiro"
                                className="inline-flex items-center gap-2 hover:text-foreground transition"
                            >
                                <Instagram className="size-4"/> Instagram
                            </a>
                            <a
                                href="https://www.linkedin.com/in/igorpimentelg/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn • Igor Pimentel Gameiro"
                                className="inline-flex items-center gap-2 hover:text-foreground transition"
                            >
                                <Linkedin className="size-4"/> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <button
                onClick={() => setPage("BENFEITOR")}
                className="fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2"
            >
                <HandHeart className="size-4"/> Apoiar
            </button>
        </div>
    );
}
