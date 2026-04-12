import {useState} from "react";
import {HandHeart, Home, Phone, Sparkles, Users} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {NAVIGATION_PAGES, PAGE_LABELS, type PageKey} from "@componente/Navbar.types";

export default function Navbar({
                                   current,
                                   onNavigate,
                                   logoSrc = "/assets/img/logo.png",
                               }: {
    current: PageKey;
    onNavigate: (k: PageKey) => void;
    logoSrc?: string;
}) {
    const [logoOk, setLogoOk] = useState(true);
    const logoWrapperClass = "h-11 w-11 rounded-2xl overflow-hidden flex items-center justify-center border bg-white";
    const iconMap: Record<PageKey, LucideIcon> = {
        HOME: Home,
        QUEM_SOMOS: Users,
        KASA: Sparkles,
        BENFEITOR: HandHeart,
        CONTATO: Phone,
        INSCRICAO_KASA_III: Sparkles,
    };

    type NavbarItem = {
        key: PageKey;
        label: string;
        icon: LucideIcon;
    };

    const items: NavbarItem[] = NAVIGATION_PAGES.map((key) => ({
        key,
        label: PAGE_LABELS[key],
        icon: iconMap[key],
    }));

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {logoOk ? (
                        <div className={`${logoWrapperClass} shadow`}>
                            <img
                                src={logoSrc}
                                alt="Movimento Kairós"
                                className="h-10 w-10 object-contain"
                                onError={() => setLogoOk(false)}
                            />
                        </div>
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
                    {items.map(({key, label, icon: Icon}) => (
                        <button
                            key={key}
                            onClick={() => onNavigate(key)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition ${
                                current === key ? "bg-accent text-accent-foreground" : ""
                            }`}
                        >
                            <Icon className="size-4"/> {label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* mobile */}
            <div className="md:hidden border-t px-2 py-2 grid grid-cols-5 gap-2">
                {items.map(({key, label}) => (
                    <button
                        key={key}
                        onClick={() => onNavigate(key)}
                        className={`px-2 py-2 rounded-xl text-xs font-medium hover:bg-accent hover:text-accent-foreground ${
                            current === key ? "bg-accent text-accent-foreground" : ""
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </header>
    );
}
