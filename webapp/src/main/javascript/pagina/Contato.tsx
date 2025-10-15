import Section from "@componente/Section";
import Card from "@componente/Card";
import {Mail, MapPin, Phone} from "lucide-react";

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
                        <input className="border rounded-xl px-3 py-2" placeholder="Seu nome"/>
                        <input className="border rounded-xl px-3 py-2" placeholder="Seu e-mail"/>
                        <textarea className="border rounded-xl px-3 py-2 min-h-28" placeholder="Escreva sua mensagem"/>
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
