import Section from "@componente/Section";
import Card from "@componente/Card";
import {Heart, Sparkles, Users} from "lucide-react";

export default function QuemSomos() {
    const dados = [
        {
            title: "Carisma",
            desc: "Viver o tempo de Deus: do Chronos ao Kairós, uma resposta concreta ao amor que transforma.",
            icon: Sparkles,
        },
        {
            title: "Missão",
            desc: "Ser instrumento do Espírito Santo por meio do acolhimento, escuta e testemunho da fé.",
            icon: Heart,
        },
        {
            title: "Comunidade",
            desc: "Mais que um grupo: uma família em Cristo, unida na partilha e no serviço.",
            icon: Users,
        },
    ];
    return (
        <>
            <Section title="Quem Somos" subtitle="Carisma • Missão • Vida fraterna">
                <div className="grid md:grid-cols-3 gap-4">
                    {dados.map((c, i) => (
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
            <Section title="Nossa História"
                     subtitle="Fundado em 11 de março de 2023, caminhamos na escuta e no serviço.">
                <div className="relative pl-6 border-l">
                    {[
                        {t: "Mar/2023", d: "Fundação do Movimento Kairós."},
                        {
                            t: "2024",
                            d: "Primeira edição do Retiro KASA, reunindo jovens em um fim de semana de imersão, cura e renovação."
                        },
                        {
                            t: "2025",
                            d: "Segunda edição do Retiro KASA, trazendo um tempo oportuno em meio a correria do dia-a-dia."
                        },
                        {
                            t: "2025 • Romaria da Juventude",
                            d: "Nosso Ministério de Música conduziu a romaria com louvores que demonstram a força da juventude Católica, mantendo a juventude unida em oração e alegria ao longo de todo o percurso."
                        },
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
        </>
    );
}
