import Section from "@componente/Section";
import Card from "@componente/Card";
import {ChevronRight, HandHeart} from "lucide-react";

export default function Benfeitor() {
    return (
        <Section title="Seja um Benfeitor"
                 subtitle="Sua doação ajuda a sustentar as frentes de evangelização e acolhimento.">
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <HandHeart className="size-6"/>
                        <div className="text-lg font-semibold">Doação via Pix</div>
                    </div>
                    <p className="mt-3 text-muted-foreground">Use a chave Pix abaixo para contribuir com qualquer
                        valor.</p>
                    <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 items-center">
                        <img src="/assets/img/qrcode-kairos.png" alt="QR Code" className="w-28 h-28 object-contain"/>
                        <div>
                            <div className="text-sm text-muted-foreground">Chave Pix</div>
                            <div className="font-mono text-base md:text-lg select-all">movimentokairos23@gmail.com</div>
                        </div>
                    </div>
                    <button
                        className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold">
                        Copiar chave Pix <ChevronRight className="size-4"/>
                    </button>
                </Card>
                <Card className="p-6">
                    <div className="text-lg font-semibold">Transparência</div>
                    <p className="mt-3 text-muted-foreground">
                        Publicaremos relatórios de prestação de contas a cada edição do KASA e atividades do movimento.
                    </p>
                    <ul className="mt-4 list-disc pl-5 text-muted-foreground space-y-1">
                        <li>Sem fins lucrativos e sem apoio financeiro externo.</li>
                        <li>Colaboração de pessoas comprometidas com causas sociais.</li>
                        <li>Uso responsável dos recursos e prioridades missionárias.</li>
                    </ul>
                </Card>
            </div>
        </Section>
    );
}
