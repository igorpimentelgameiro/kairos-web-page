import Section from "@componente/Section";
import Card from "@componente/Card";
import Pill from "@componente/Pill";
import {CalendarClock, ChevronRight, MapPin, Sparkles} from "lucide-react";

export default function Kasa() {
    return (
        <>
            <Section title="Retiro KASA" subtitle="Um fim de semana de encontro, cura e renovação da fé.">
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        {
                            tag: "Animação",
                            img: "/assets/img/animacao.jpg",
                            text: "Muito mais que um encontro: é um chamado à transformação!"
                        },
                        {
                            tag: "Adoração",
                            img: "/assets/img/adoracao.jpg",
                            text: "Os frutos nascem de uma vida de oração, serviço e amor ao próximo."
                        },
                        {
                            tag: "Gincana",
                            img: "/assets/img/gincana.jpg",
                            text: "Vivemos a fraternidade com alegria, partilha e unidade."
                        },
                    ].map((k, i) => (
                        <Card key={i} className="overflow-hidden">
                            <div className="aspect-[4/3] bg-cover bg-center"
                                 style={{backgroundImage: `url(${k.img})`}}/>
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
                                    <div className="text-lg font-semibold flex items-center gap-2">
                                        <CalendarClock className="size-5"/> {e.quando}
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2">
                                        <MapPin className="size-4"/> {e.onde}
                                    </div>
                                </div>
                                <Pill>{e.status}</Pill>
                            </div>
                            <button
                                className="mt-4 w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold">
                                Quero participar
                            </button>
                        </Card>
                    ))}
                </div>
            </Section>
        </>
    );
}
