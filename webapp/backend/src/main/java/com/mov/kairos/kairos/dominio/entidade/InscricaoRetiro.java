package com.mov.kairos.kairos.dominio.entidade;

import java.time.LocalDate;
import java.util.Objects;

public record InscricaoRetiro(
        Long id,
        String nomeCompleto,
        LocalDate dataNascimento,
        Integer idade,
        ResponsavelLegal responsavelLegal,
        String documentoIdentificacao,
        String contatoIndividual,
        String endereco,
        String tamanhoCamisa,
        ContatoEmergencia contatoEmergencia,
        String alergiasIntolerancias,
        String necessidadesEspeciais,
        boolean participouDeRetiro,
        String comunidadeOrigem,
        String donsHabilidades,
        FormaPagamento formaPagamento,
        String comprovantePagamento,
        boolean consentimentoImagem,
        boolean consentimentoDados
) {

    public InscricaoRetiro {
        validarObrigatorio(nomeCompleto, "nomeCompleto");
        Objects.requireNonNull(dataNascimento, "dataNascimento nao pode ser nulo");
        Objects.requireNonNull(contatoIndividual, "contatoIndividual nao pode ser nulo");
        Objects.requireNonNull(endereco, "endereco nao pode ser nulo");
        Objects.requireNonNull(tamanhoCamisa, "tamanhoCamisa nao pode ser nulo");
        Objects.requireNonNull(contatoEmergencia, "contatoEmergencia nao pode ser nulo");
        Objects.requireNonNull(comunidadeOrigem, "comunidadeOrigem nao pode ser nulo");
        Objects.requireNonNull(donsHabilidades, "donsHabilidades nao pode ser nulo");
        Objects.requireNonNull(formaPagamento, "formaPagamento nao pode ser nulo");

        validarObrigatorio(documentoIdentificacao, "documentoIdentificacao");
        validarObrigatorio(contatoIndividual, "contatoIndividual");
        validarObrigatorio(endereco, "endereco");
        validarObrigatorio(tamanhoCamisa, "tamanhoCamisa");
        validarObrigatorio(comunidadeOrigem, "comunidadeOrigem");
        validarObrigatorio(donsHabilidades, "donsHabilidades");

        if (idade != null && idade < 0) {
            throw new IllegalArgumentException("idade deve ser positiva");
        }
        if (idade != null && idade < 18) {
            if (responsavelLegal == null || !responsavelLegal.presente()) {
                throw new IllegalArgumentException("Responsavel legal obrigatorio para menores de idade");
            }
        }

        if (!consentimentoDados) {
            throw new IllegalArgumentException("Consentimento de dados e obrigatorio para a inscricao");
        }
    }

    private static void validarObrigatorio(String valor, String campo) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(campo + " nao pode ser nulo ou vazio");
        }
    }
}
