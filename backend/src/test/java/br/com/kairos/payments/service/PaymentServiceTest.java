package br.com.kairos.payments.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.kairos.payments.dto.PaymentRequest;
import br.com.kairos.payments.dto.PaymentResponse;
import br.com.kairos.payments.exception.FirebaseUpdateException;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import java.math.BigDecimal;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;

class PaymentServiceTest {

    @Test
    void deveProcessarPagamentoEAtualizarStatusNoFirebase() {
        FirebaseDatabase firebaseDatabase = mock(FirebaseDatabase.class);
        DatabaseReference reference = mock(DatabaseReference.class);
        when(firebaseDatabase.getReference("inscricoes/insc-123")).thenReturn(reference);
        when(reference.updateChildrenAsync(anyMap())).thenReturn(ApiFutures.immediateFuture(null));

        Executor executor = Runnable::run;
        PaymentService paymentService = new PaymentService(firebaseDatabase, executor);

        PaymentResponse response = paymentService.process(
            new PaymentRequest("insc-123", BigDecimal.valueOf(150), "tok_demo_123")
        );

        verify(firebaseDatabase, times(2)).getReference("inscricoes/insc-123");
        verify(reference, times(2)).updateChildrenAsync(anyMap());
        assertThat(response.status()).isEqualTo("PROCESSANDO");
        assertThat(response.inscricaoId()).isEqualTo("insc-123");
    }

    @Test
    void deveLancarErroQuandoAtualizacaoInicialNoFirebaseFalhar() {
        FirebaseDatabase firebaseDatabase = mock(FirebaseDatabase.class);
        DatabaseReference reference = mock(DatabaseReference.class);
        when(firebaseDatabase.getReference("inscricoes/insc-erro")).thenReturn(reference);

        @SuppressWarnings("unchecked")
        ApiFuture<Void> failedFuture = mock(ApiFuture.class);
        when(reference.updateChildrenAsync(anyMap())).thenReturn(failedFuture);
        try {
            when(failedFuture.get(10L, TimeUnit.SECONDS)).thenThrow(new RuntimeException("boom"));
        } catch (Exception ignored) {
            throw new AssertionError(ignored);
        }

        PaymentService paymentService = new PaymentService(firebaseDatabase, Runnable::run);

        assertThatThrownBy(() -> paymentService.process(
            new PaymentRequest("insc-erro", BigDecimal.valueOf(150), "tok_demo_123")
        ))
            .isInstanceOf(FirebaseUpdateException.class)
            .hasMessageContaining("inscricaoId=insc-erro");
    }

    @Test
    void deveAtualizarErroQuandoGatewayRecusarToken() {
        FirebaseDatabase firebaseDatabase = mock(FirebaseDatabase.class);
        DatabaseReference reference = mock(DatabaseReference.class);
        when(firebaseDatabase.getReference("inscricoes/insc-fail")).thenReturn(reference);
        when(reference.updateChildrenAsync(anyMap())).thenReturn(ApiFutures.immediateFuture(null));

        PaymentService paymentService = new PaymentService(firebaseDatabase, Runnable::run);

        PaymentResponse response = paymentService.process(
            new PaymentRequest("insc-fail", BigDecimal.valueOf(150), "fail_demo")
        );

        verify(reference, times(2)).updateChildrenAsync(anyMap());
        assertThat(response.status()).isEqualTo("PROCESSANDO");
    }
}
