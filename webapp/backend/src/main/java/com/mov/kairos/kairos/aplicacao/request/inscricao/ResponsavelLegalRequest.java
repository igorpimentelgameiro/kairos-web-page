package com.mov.kairos.kairos.aplicacao.request.inscricao;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponsavelLegalRequest(
        String nome,
        String contato
) {
}
