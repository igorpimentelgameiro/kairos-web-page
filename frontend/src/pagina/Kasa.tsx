import Section from "@componente/Section";
import Card from "@componente/Card";
import Pill from "@componente/Pill";
import {CalendarClock, MapPin, Sparkles} from "lucide-react";

type KasaProps = {
    onParticipar: () => void;
};

export default function Kasa({onParticipar}: KasaProps) {
    const edicoes = [
        {
            nome: "Kasa III",
            quando: "20–22 Mar 2026",
            onde: "Belém/PA",
            status: "Inscrições Encerradas",
            botao: "Encerrado",
            desabilitado: true,
        },
        {
            nome: "Kasa IV",
            quando: "Em definição",
            onde: "Belém/PA",
            status: "Em Breve",
            botao: "Em Breve",
            desabilitado: true,
        },
    ];

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
                            <div className="image-hover-shell aspect-[4/3]">
                                <div
                                    className="image-hover-media h-full w-full bg-cover bg-center"
                                    style={{backgroundImage: `url(${k.img})`}}
                                />
                            </div>
                            <div className="p-5">
                                <Pill><Sparkles className="size-3.5"/> {k.tag}</Pill>
                                <p className="mt-3 text-muted-foreground">{k.text}</p>
                                {/*<button
                                    className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold">
                                    Saber mais <ChevronRight className="size-4"/>
                                </button>*/}
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section title="Próximas datas" subtitle="Participe da próxima edição do KASA.">
                <div className="grid md:grid-cols-2 gap-4">
                    {edicoes.map((edicao) => (
                        <Card key={edicao.nome} className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        {edicao.nome}
                                    </div>
                                    <div className="text-lg font-semibold flex items-center gap-2">
                                        <CalendarClock className="size-5"/> {edicao.quando}
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2">
                                        <MapPin className="size-4"/> {edicao.onde}
                                    </div>
                                </div>
                                <Pill>{edicao.status}</Pill>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!edicao.desabilitado) {
                                        onParticipar();
                                    }
                                }}
                                disabled={edicao.desabilitado}
                                className="mt-4 w-full px-4 py-2 rounded-xl border font-semibold disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-accent disabled:text-muted-foreground disabled:border"
                            >
                                {edicao.botao}
                            </button>
                        </Card>
                    ))}
                </div>
            </Section>
        </>
    );
}
