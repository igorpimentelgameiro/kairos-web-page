package com.mov.kairos.kairos.aplicacao.config;

import com.mov.kairos.kairos.dominio.casouso.CadastrarInscricao;
import com.mov.kairos.kairos.dominio.repositorio.IInscricaoRepositorio;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InscricaoUseCaseConfig {

    @Bean
    public CadastrarInscricao cadastrarInscricao(IInscricaoRepositorio inscricaoRepositorio) {
        return new CadastrarInscricao(inscricaoRepositorio);
    }
}
