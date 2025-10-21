package com.mov.kairos.kairos.aplicacao.request.inscricao;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ContatoEmergenciaRequest(
        @NotBlank String nome,
        @NotBlank String parentesco,
        @NotBlank String contato
) {
}
