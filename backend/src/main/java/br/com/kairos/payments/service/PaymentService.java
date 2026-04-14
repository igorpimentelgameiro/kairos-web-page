package br.com.kairos.payments.service;

import br.com.kairos.payments.dto.PaymentRequest;
import br.com.kairos.payments.dto.PaymentResponse;
import br.com.kairos.payments.exception.FirebaseUpdateException;
import br.com.kairos.payments.exception.PaymentProcessingException;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PaymentService {

    private static final String PAYMENT_PENDING = "PROCESSANDO";
    private static final String PAYMENT_CONFIRMED = "PAGO";

    private final FirebaseDatabase firebaseDatabase;
    private final Executor paymentExecutor;

    @Autowired
    public PaymentService(FirebaseDatabase firebaseDatabase) {
        this(firebaseDatabase, Executors.newVirtualThreadPerTaskExecutor());
    }

    PaymentService(FirebaseDatabase firebaseDatabase, Executor paymentExecutor) {
        this.firebaseDatabase = firebaseDatabase;
        this.paymentExecutor = paymentExecutor;
    }

    public PaymentResponse process(PaymentRequest request) {
        updateStatus(request.inscricaoId(), PAYMENT_PENDING, "Pagamento em processamento", request.valor());

        CompletableFuture.runAsync(() -> {
            simulatePaymentGatewayCall(request);
            updateStatus(request.inscricaoId(), PAYMENT_CONFIRMED, "Pagamento confirmado", request.valor());
        }, paymentExecutor).exceptionally(throwable -> {
            updateStatus(request.inscricaoId(), "ERRO", throwable.getMessage(), request.valor());
            return null;
        });

        return new PaymentResponse(
            PAYMENT_PENDING,
            "Pagamento recebido. A confirmacao sera publicada no Firebase em tempo real.",
            request.inscricaoId()
        );
    }

    private void simulatePaymentGatewayCall(PaymentRequest request) {
        if (!StringUtils.hasText(request.tokenPagamento()) || request.tokenPagamento().startsWith("fail_")) {
            throw new PaymentProcessingException("Gateway recusou o token de pagamento informado.");
        }

        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new PaymentProcessingException("Processamento interrompido antes da confirmacao.", exception);
        }
    }

    private void updateStatus(String inscricaoId, String status, String detalhe, java.math.BigDecimal valor) {
        DatabaseReference reference = firebaseDatabase.getReference("inscricoes/" + inscricaoId);
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("statusPagamento", status);
        payload.put("detalhePagamento", detalhe);
        payload.put("atualizadoEm", System.currentTimeMillis());

        Map<String, Object> pagamento = new LinkedHashMap<>();
        pagamento.put("valor", valor);
        pagamento.put("status", status);
        pagamento.put("detalhe", detalhe);
        pagamento.put("gateway", "simulado");
        pagamento.put("atualizadoEm", System.currentTimeMillis());
        payload.put("pagamento", pagamento);

        try {
            reference.updateChildrenAsync(payload).get(10, TimeUnit.SECONDS);
        } catch (Exception exception) {
            throw new FirebaseUpdateException(
                "Falha ao atualizar o status da inscricao no Firebase para inscricaoId=%s"
                    .formatted(inscricaoId),
                exception
            );
        }
    }
}
