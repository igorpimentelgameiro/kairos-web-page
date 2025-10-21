package com.mov.kairos.kairos.dominio.casouso;

import com.mov.kairos.kairos.dominio.entidade.InscricaoRetiro;
import com.mov.kairos.kairos.dominio.repositorio.IInscricaoRepositorio;
import java.util.Objects;

public class CadastrarInscricao {

    private final IInscricaoRepositorio inscricaoRepositorio;

    public CadastrarInscricao(IInscricaoRepositorio inscricaoRepositorio) {
        this.inscricaoRepositorio = Objects.requireNonNull(inscricaoRepositorio, "inscricaoRepositorio nao pode ser nulo");
    }

    public InscricaoRetiro executar(InscricaoRetiro inscricao) {
        Objects.requireNonNull(inscricao, "inscricao nao pode ser nula");
        return inscricaoRepositorio.salvar(inscricao);
    }
}
