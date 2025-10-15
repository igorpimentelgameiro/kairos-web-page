package br.jus.tjpa.kairos.aplicacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "br.jus.tjpa.kairos")
public class KairosApplication {

    public static void main(String[] args) {
        SpringApplication.run(KairosApplication.class, args);
    }

}
