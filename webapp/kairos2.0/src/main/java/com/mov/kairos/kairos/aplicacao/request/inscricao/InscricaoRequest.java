package com.mov.kairos.kairos.aplicacao.request.inscricao;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mov.kairos.kairos.dominio.entidade.FormaPagamento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record InscricaoRequest(
        @NotBlank String nomeCompleto,
        @NotNull @Past(message = "dataNascimento deve ser anterior a hoje") LocalDate dataNascimento,
        @Positive(message = "idade deve ser maior que zero") Integer idade,
        ResponsavelLegalRequest responsavelLegal,
        @NotBlank String documentoIdentificacao,
        @NotBlank String contatoIndividual,
        @NotBlank String endereco,
        @NotBlank String tamanhoCamisa,
        @NotNull @Valid ContatoEmergenciaRequest contatoEmergencia,
        String alergiasIntolerancias,
        String necessidadesEspeciais,
        boolean participouDeRetiro,
        @NotBlank String comunidadeOrigem,
        @NotBlank String donsHabilidades,
        @NotNull FormaPagamento formaPagamento,
        String comprovantePagamento,
        boolean consentimentoImagem,
        @AssertTrue(message = "consentimentoDados deve estar aceito") boolean consentimentoDados
) {
}
