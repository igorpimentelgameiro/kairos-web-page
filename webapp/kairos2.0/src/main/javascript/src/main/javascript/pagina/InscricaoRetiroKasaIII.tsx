import {FormEvent, useMemo, useState} from "react";
import Section from "@componente/Section";
import Card from "@componente/Card";
import {ArrowLeft, CalendarClock, ClipboardCheck, HandHeart, MapPin, Shield} from "lucide-react";

type InscricaoRetiroKasaIIIProps = {
    onVoltar: () => void;
};

export default function InscricaoRetiroKasaIII({onVoltar}: InscricaoRetiroKasaIIIProps) {
    const [nome, setNome] = useState("");
    const [contato, setContato] = useState("");
    const [status, setStatus] = useState<"idle" | "submitted">("idle");

    const feedback = useMemo(() => {
        if (status === "submitted") {
            return `Obrigado, ${nome.split(" ")[0] || "participante"}! Entraremos em contato assim que o formulário completo estiver ativo.`;
        }
        return null;
    }, [status, nome]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("submitted");
    };

    return (
        <div className="space-y-8">
            <div className="max-w-6xl mx-auto px-4 pt-8">
                <button
                    type="button"
                    onClick={onVoltar}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                    <ArrowLeft className="size-4"/> Voltar para informações do KASA
                </button>
            </div>

            <Section
                title="Inscrição Retiro Kasa III"
                subtitle="Reserve sua vaga preenchendo os dados abaixo. Entraremos em contato com os próximos passos."
            >
                <div className="grid md:grid-cols-[2fr,3fr] gap-6">
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <CalendarClock className="size-6"/>
                            <div>
                                <div className="text-lg font-semibold">20 a 22 de março de 2026</div>
                                <div className="text-sm text-muted-foreground">Belém • Centro de Evangelização Kairós</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin className="size-5"/> Avenida Conselheiro Furtado, 1571 — Nazaré
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Shield className="size-5"/> Vagas limitadas, confirmação mediante contato da equipe.
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <HandHeart className="size-5"/> Contribuição sugerida: R$ 180,00 (pode ser parcelado/negociado).
                        </div>
                    </Card>

                    <Card className="p-6 space-y-5">
                        <div>
                            <h3 className="text-lg font-semibold">Próximos passos</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                O formulário completo de inscrição será disponibilizado em breve. Enquanto isso, deixe seus
                                dados para que a equipe entre em contato com orientações, lista de materiais e
                                acompanhamento espiritual.
                            </p>
                        </div>
                        <form className="grid gap-3" onSubmit={handleSubmit}>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="preinscricao-nome">
                                Nome completo
                            </label>
                            <input
                                id="preinscricao-nome"
                                className="border rounded-xl px-3 py-2 text-sm"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                required
                            />
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="preinscricao-contato">
                                Contato (WhatsApp ou e-mail)
                            </label>
                            <input
                                id="preinscricao-contato"
                                className="border rounded-xl px-3 py-2 text-sm"
                                placeholder="Inclua DDD ou e-mail válido"
                                value={contato}
                                onChange={(event) => setContato(event.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="mt-2 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                            >
                                Quero ser avisado
                            </button>
                        </form>
                        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground flex gap-3 items-start">
                            <ClipboardCheck className="size-5 mt-0.5"/>
                            <p>
                                Assim que o formulário oficial estiver ativo você receberá o link por e-mail e WhatsApp.
                                Continue acompanhando nossas redes para novidades e momentos de preparação espiritual.
                            </p>
                        </div>
                        {feedback ? (
                            <div className="rounded-xl border p-4 bg-primary/5 text-sm text-primary">
                                {feedback}
                            </div>
                        ) : null}
                    </Card>
                </div>
            </Section>
        </div>
    );
}
