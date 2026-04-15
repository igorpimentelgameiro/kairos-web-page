package br.com.kairos.payments.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.kairos.payments.dto.PaymentRequest;
import br.com.kairos.payments.dto.PaymentResponse;
import br.com.kairos.payments.exception.FirebaseUpdateException;
import br.com.kairos.payments.exception.GlobalExceptionHandler;
import br.com.kairos.payments.exception.PaymentProcessingException;
import br.com.kairos.payments.service.PaymentService;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PaymentController.class)
@Import(GlobalExceptionHandler.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PaymentService paymentService;

    @Test
    void deveAceitarPagamentoValido() throws Exception {
        when(paymentService.process(any(PaymentRequest.class))).thenReturn(
            new PaymentResponse("PROCESSANDO", "Pagamento recebido.", "insc-123")
        );

        mockMvc.perform(post("/pagamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "inscricaoId": "insc-123",
                      "valor": 150.00,
                      "tokenPagamento": "tok_demo_123"
                    }
                    """))
            .andExpect(status().isAccepted())
            .andExpect(jsonPath("$.status").value("PROCESSANDO"))
            .andExpect(jsonPath("$.inscricaoId").value("insc-123"));
    }

    @Test
    void deveRetornarBadRequestQuandoPayloadForInvalido() throws Exception {
        mockMvc.perform(post("/pagamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "inscricaoId": "",
                      "valor": 0,
                      "tokenPagamento": ""
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Validation failed"))
            .andExpect(jsonPath("$.details.length()").value(3));
    }

    @Test
    void deveRetornarBadGatewayQuandoServicoFalhar() throws Exception {
        when(paymentService.process(any(PaymentRequest.class))).thenThrow(
            new PaymentProcessingException("Gateway recusou o token de pagamento informado.")
        );

        mockMvc.perform(post("/pagamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "inscricaoId": "insc-123",
                      "valor": 150.00,
                      "tokenPagamento": "fail_demo"
                    }
                    """))
            .andExpect(status().isBadGateway())
            .andExpect(jsonPath("$.error").value("Payment processing failed"))
            .andExpect(jsonPath("$.details[0]").value("Gateway recusou o token de pagamento informado."));
    }

    @Test
    void deveRetornarErroInternoQuandoAtualizacaoNoFirebaseFalhar() throws Exception {
        when(paymentService.process(any(PaymentRequest.class))).thenThrow(
            new FirebaseUpdateException("Falha ao atualizar status", new RuntimeException("boom"))
        );

        mockMvc.perform(post("/pagamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "inscricaoId": "insc-123",
                      "valor": 150.00,
                      "tokenPagamento": "tok_demo_123"
                    }
                    """))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.error").value("Firebase update failed"))
            .andExpect(jsonPath("$.details[0]").value("Falha ao atualizar status"));
    }

    @Test
    void deveRetornarErroInternoQuandoOcorrrerErroInesperado() throws Exception {
        when(paymentService.process(any(PaymentRequest.class))).thenThrow(
            new IllegalStateException("Falha inesperada")
        );

        mockMvc.perform(post("/pagamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "inscricaoId": "insc-123",
                      "valor": 150.00,
                      "tokenPagamento": "tok_demo_123"
                    }
                    """))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.error").value("Unexpected server error"))
            .andExpect(jsonPath("$.details[0]").value("Falha inesperada"));
    }
}
