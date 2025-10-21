package com.mov.kairos.kairos.dominio.entidade;

public record ContatoEmergencia(String nome, String parentesco, String contato) {

    public ContatoEmergencia {
        validarCampo(nome, "nome");
        validarCampo(parentesco, "parentesco");
        validarCampo(contato, "contato");
    }

    private static void validarCampo(String valor, String campo) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("ContatoEmergencia." + campo + " nao pode ser nulo ou vazio");
        }
    }
}
