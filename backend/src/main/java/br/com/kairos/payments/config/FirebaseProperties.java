package br.com.kairos.payments.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "kairos.firebase")
public record FirebaseProperties(
    @NotBlank String databaseUrl,
    @NotBlank String projectId,
    String credentialsPath
) {
}
