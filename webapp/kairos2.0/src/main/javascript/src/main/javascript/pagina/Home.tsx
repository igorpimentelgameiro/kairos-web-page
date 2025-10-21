import Section from "@componente/Section";
import Card from "@componente/Card";
import Pill from "@componente/Pill";
import {ChevronRight, HandHeart, Heart, Sparkles, Users} from "lucide-react";

export default function Home({onCTA, goBenfeitor}: { onCTA: () => void; goBenfeitor: () => void }) {
    return (
        <div className="relative">
            <div
                className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-white to-transparent dark:from-amber-950/30 dark:via-background dark:to-transparent"/>
            <Section
                title="Kairós — o tempo de Deus"
                subtitle="Uma família em Cristo vivendo a presença do Espírito Santo, gerando frutos e servindo com amor."
            >
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-2">
                            <Pill><Sparkles className="size-3.5"/> Carisma</Pill>
                            <Pill><Heart className="size-3.5"/> Missão</Pill>
                            <Pill><Users className="size-3.5"/> Comunidade</Pill>
                        </div>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Somos um movimento pertencente à Basílica Santuário de Nossa Senhora de Nazaré (Belém/PA),
                            vivendo e
                            anunciando o <em>Kairós</em>: o tempo da Graça. Nosso chamado é conduzir pessoas a uma
                            experiência real,
                            profunda e transformadora com Deus.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={onCTA}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2"
                            >
                                Participar do KASA <ChevronRight className="size-4"/>
                            </button>
                            <button
                                onClick={goBenfeitor}
                                className="px-4 py-2 rounded-xl border font-semibold flex items-center gap-2"
                            >
                                Seja um Benfeitor <HandHeart className="size-4"/>
                            </button>
                        </div>
                    </div>
                    <Card className="overflow-hidden">
                        {/* tenta usar imagem local e cai para Unsplash se faltar */}
                        <div
                            className="aspect-[16/10] w-full bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url(/assets/img/bg-masthead.jpg), url(https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400&auto=format&fit=crop)",
                            }}
                        />
                        <div className="p-5">
                            <div className="font-semibold">Família em Cristo</div>
                            <p className="text-sm text-muted-foreground">O Kairós é mais que amizade: é unidade,
                                partilha e envio.</p>
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
