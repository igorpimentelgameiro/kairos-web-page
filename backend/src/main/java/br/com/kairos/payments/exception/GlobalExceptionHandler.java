package br.com.kairos.payments.exception;

import br.com.kairos.payments.dto.ApiErrorResponse;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        List<String> details = exception.getBindingResult()
            .getAllErrors()
            .stream()
            .map(error -> {
                if (error instanceof FieldError fieldError) {
                    return fieldError.getField() + ": " + fieldError.getDefaultMessage();
                }
                return error.getDefaultMessage();
            })
            .toList();

        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed", details);
    }

    @ExceptionHandler(PaymentProcessingException.class)
    ResponseEntity<ApiErrorResponse> handlePayment(PaymentProcessingException exception) {
        return buildResponse(
            HttpStatus.BAD_GATEWAY,
            "Payment processing failed",
            List.of(exception.getMessage())
        );
    }

    @ExceptionHandler(FirebaseUpdateException.class)
    ResponseEntity<ApiErrorResponse> handleFirebase(FirebaseUpdateException exception) {
        return buildResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Firebase update failed",
            List.of(exception.getMessage())
        );
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiErrorResponse> handleUnexpected(Exception exception) {
        return buildResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Unexpected server error",
            List.of(exception.getMessage())
        );
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
        HttpStatus status,
        String error,
        List<String> details
    ) {
        return ResponseEntity.status(status).body(
            new ApiErrorResponse(Instant.now(), status.value(), error, details)
        );
    }
}
