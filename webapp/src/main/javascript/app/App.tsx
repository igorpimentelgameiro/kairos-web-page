import {useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Navbar, {type PageKey, PAGES,} from "@componente/Navbar";
import Home from "@pagina/Home";
import QuemSomos from "@pagina/QuemSomos";
import Kasa from "@pagina/Kasa";
import Benfeitor from "@pagina/Benfeitor";
import Contato from "@pagina/Contato";
import {HandHeart, Mail, MapPin, Phone} from "lucide-react";
import useDarkMode from "@componente/hooks/useDarkMode";

export default function App() {
    const [page, setPage] = useState<PageKey>("HOME");
    const {enabled: dark, setEnabled} = useDarkMode();

    const CurrentPage = useMemo(() => {
        switch (page) {
            case "HOME":
                return <Home onCTA={() => setPage("KASA")} goBenfeitor={() => setPage("BENFEITOR")}/>;
            case "QUEM_SOMOS":
                return <QuemSomos/>;
            case "KASA":
                return <Kasa/>;
            case "BENFEITOR":
                return <Benfeitor/>;
            case "CONTATO":
                return <Contato/>;
            default:
                return null;
        }
    }, [page]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar
                current={page}
                onNavigate={setPage}
                toggleTheme={() => setEnabled(!dark)}
                dark={dark}
                logoSrc="/assets/img/logo.png"
            />

            <AnimatePresence mode="wait">
                <motion.main key={page} initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}}
                             exit={{opacity: 0, y: -6}} transition={{duration: 0.25}}>
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
                            {(Object.keys(PAGES) as PageKey[]).map((k) => (
                                <button key={k} onClick={() => setPage(k)}
                                        className="px-3 py-1.5 rounded-xl border hover:bg-accent hover:text-accent-foreground">
                                    {PAGES[k]}
                                </button>
                            ))}
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
