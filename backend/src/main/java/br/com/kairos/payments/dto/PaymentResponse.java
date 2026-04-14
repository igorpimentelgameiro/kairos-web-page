package br.com.kairos.payments.dto;

public record PaymentResponse(
    String status,
    String mensagem,
    String inscricaoId
) {
}
