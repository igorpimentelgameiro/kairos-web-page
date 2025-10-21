package com.mov.kairos.kairos.aplicacao.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = "com.mov.kairos.kairos.infraestrutura")
@EnableJpaRepositories(basePackages = "com.mov.kairos.kairos.infraestrutura")
public class JpaConfig {
}
