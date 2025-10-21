package com.mov.kairos.kairos.aplicacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.mov.kairos.kairos")
public class KairosApplication {

    public static void main(String[] args) {
        SpringApplication.run(KairosApplication.class, args);
    }
}
