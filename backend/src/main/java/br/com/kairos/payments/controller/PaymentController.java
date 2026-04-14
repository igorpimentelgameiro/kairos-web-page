package br.com.kairos.payments.controller;

import br.com.kairos.payments.dto.PaymentRequest;
import br.com.kairos.payments.dto.PaymentResponse;
import br.com.kairos.payments.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pagamentos")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> processarPagamento(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.process(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
