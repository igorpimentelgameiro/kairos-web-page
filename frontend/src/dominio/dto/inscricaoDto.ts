export type FormaPagamento = "PIX" | "CREDITO" | "DINHEIRO";

export type ResponsavelLegalDto = {
    nome: string;
    contato: string;
};

export type ContatoEmergenciaDto = {
    nome: string;
    parentesco: string;
    contato: string;
};

export type ComprovantePagamentoDto = {
    nomeArquivo: string;
    mimeType: string;
    url?: string | null;
    conteudoBase64?: string | null;
    caminhoStorage?: string | null;
    enviadoEm?: string | null;
};

export type InscricaoRequestDto = {
    nomeCompleto: string;
    dataNascimento: string;
    idade: number;
    responsavelLegal?: ResponsavelLegalDto | null;
    documentoIdentificacao: string;
    contatoIndividual: string;
    endereco: string;
    tamanhoCamisa: string;
    contatoEmergencia: ContatoEmergenciaDto;
    alergiasIntolerancias?: string | null;
    necessidadesEspeciais?: string | null;
    participouDeRetiro: boolean;
    comunidadeOrigem: string;
    donsHabilidades: string;
    formaPagamento: FormaPagamento;
    comprovantePagamento?: ComprovantePagamentoDto | null;
    consentimentoImagem: boolean;
    consentimentoDados: boolean;
    observacoes?: string | null;
};

export type InscricaoResponseDto = {
    inscricaoId: number;
    mensagem: string;
};
