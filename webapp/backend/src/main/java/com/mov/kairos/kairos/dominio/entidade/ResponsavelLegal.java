package com.mov.kairos.kairos.dominio.entidade;

public record ResponsavelLegal(String nome, String contato) {

    public ResponsavelLegal {
        boolean nomeInformado = nome != null;
        boolean contatoInformado = contato != null;

        if (nomeInformado != contatoInformado) {
            throw new IllegalArgumentException("Responsavel legal deve possuir nome e contato ou nenhum dos dois");
        }

        if (nomeInformado) {
            validarTexto(nome, "nome");
            validarTexto(contato, "contato");
        }
    }

    public boolean presente() {
        return nome != null && contato != null;
    }

    private static void validarTexto(String valor, String campo) {
        if (valor.isBlank()) {
            throw new IllegalArgumentException("ResponsavelLegal." + campo + " nao pode ser vazio");
        }
    }
}
