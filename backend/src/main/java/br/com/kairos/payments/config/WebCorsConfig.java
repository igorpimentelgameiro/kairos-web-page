package br.com.kairos.payments.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins;

    public WebCorsConfig(
        @Value("${kairos.cors.allowed-origins:http://localhost:5173,https://kairosmov.com.br}") String[] allowedOrigins
    ) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/pagamentos/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("POST", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(false);
    }
}
