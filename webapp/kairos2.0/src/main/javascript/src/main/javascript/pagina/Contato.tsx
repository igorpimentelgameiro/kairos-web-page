import Section from "@componente/Section";
import Card from "@componente/Card";
import {Mail, MapPin, Phone} from "lucide-react";

const FIELD_BASE_CLASS =
    "border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40";

const TEXTAREA_CLASS = `${FIELD_BASE_CLASS} min-h-28`;

export default function Contato() {
    return (
        <Section title="Fale Conosco" subtitle="Estamos próximos de você.">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="text-lg font-semibold">Endereço & Contatos</div>
                    <div className="mt-4 space-y-2 text-muted-foreground">
                        <div className="flex items-start gap-3">
                            <MapPin className="size-5 mt-0.5"/> Av. Conselheiro Furtado, 1571 - Nazaré, Belém - PA •
                            Comunidade Santa Bernadette
                        </div>
                        <div className="flex items-center gap-3"><Mail className="size-5"/> movimentokairos23@gmail.com
                        </div>
                        <div className="flex items-center gap-3"><Phone className="size-5"/> +55 (91) 98615-3379</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-lg font-semibold">Envie uma mensagem</div>
                    <form className="mt-4 grid gap-3">
                        <input className={FIELD_BASE_CLASS} placeholder="Seu nome"/>
                        <input className={FIELD_BASE_CLASS} placeholder="Seu e-mail"/>
                        <textarea className={TEXTAREA_CLASS} placeholder="Escreva sua mensagem"/>
                        <button type="button"
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold">
                            Enviar
                        </button>
                    </form>
                </Card>
            </div>
        </Section>
    );
}
