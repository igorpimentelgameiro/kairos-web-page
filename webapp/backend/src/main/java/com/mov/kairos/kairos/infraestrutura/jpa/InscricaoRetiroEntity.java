package com.mov.kairos.kairos.infraestrutura.jpa;

import com.mov.kairos.kairos.dominio.entidade.FormaPagamento;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "inscricoes_retiro")
public class InscricaoRetiroEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "idade")
    private Integer idade;

    @Column(name = "responsavel_nome")
    private String responsavelLegalNome;

    @Column(name = "responsavel_contato")
    private String responsavelLegalContato;

    @Column(name = "documento_identificacao", nullable = false)
    private String documentoIdentificacao;

    @Column(name = "contato_individual", nullable = false)
    private String contatoIndividual;

    @Column(name = "endereco", nullable = false, length = 1024)
    private String endereco;

    @Column(name = "tamanho_camisa", nullable = false)
    private String tamanhoCamisa;

    @Column(name = "emergencia_nome", nullable = false)
    private String contatoEmergenciaNome;

    @Column(name = "emergencia_parentesco", nullable = false)
    private String contatoEmergenciaParentesco;

    @Column(name = "emergencia_contato", nullable = false)
    private String contatoEmergenciaContato;

    @Column(name = "alergias", length = 2048)
    private String alergiasIntolerancias;

    @Column(name = "necessidades_especiais", length = 2048)
    private String necessidadesEspeciais;

    @Column(name = "participou_retiro", nullable = false)
    private boolean participouDeRetiro;

    @Column(name = "comunidade_origem", nullable = false)
    private String comunidadeOrigem;

    @Column(name = "dons_habilidades", nullable = false, length = 1024)
    private String donsHabilidades;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pagamento", nullable = false)
    private FormaPagamento formaPagamento;

    @Column(name = "comprovante_pagamento")
    private String comprovantePagamento;

    @Column(name = "consentimento_imagem", nullable = false)
    private boolean consentimentoImagem;

    @Column(name = "consentimento_dados", nullable = false)
    private boolean consentimentoDados;

    protected InscricaoRetiroEntity() {
        // construtor para JPA
    }

    private InscricaoRetiroEntity(Builder builder) {
        this.id = builder.id;
        this.nomeCompleto = builder.nomeCompleto;
        this.dataNascimento = builder.dataNascimento;
        this.idade = builder.idade;
        this.responsavelLegalNome = builder.responsavelLegalNome;
        this.responsavelLegalContato = builder.responsavelLegalContato;
        this.documentoIdentificacao = builder.documentoIdentificacao;
        this.contatoIndividual = builder.contatoIndividual;
        this.endereco = builder.endereco;
        this.tamanhoCamisa = builder.tamanhoCamisa;
        this.contatoEmergenciaNome = builder.contatoEmergenciaNome;
        this.contatoEmergenciaParentesco = builder.contatoEmergenciaParentesco;
        this.contatoEmergenciaContato = builder.contatoEmergenciaContato;
        this.alergiasIntolerancias = builder.alergiasIntolerancias;
        this.necessidadesEspeciais = builder.necessidadesEspeciais;
        this.participouDeRetiro = builder.participouDeRetiro;
        this.comunidadeOrigem = builder.comunidadeOrigem;
        this.donsHabilidades = builder.donsHabilidades;
        this.formaPagamento = builder.formaPagamento;
        this.comprovantePagamento = builder.comprovantePagamento;
        this.consentimentoImagem = builder.consentimentoImagem;
        this.consentimentoDados = builder.consentimentoDados;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public Integer getIdade() {
        return idade;
    }

    public String getResponsavelLegalNome() {
        return responsavelLegalNome;
    }

    public String getResponsavelLegalContato() {
        return responsavelLegalContato;
    }

    public String getDocumentoIdentificacao() {
        return documentoIdentificacao;
    }

    public String getContatoIndividual() {
        return contatoIndividual;
    }

    public String getEndereco() {
        return endereco;
    }

    public String getTamanhoCamisa() {
        return tamanhoCamisa;
    }

    public String getContatoEmergenciaNome() {
        return contatoEmergenciaNome;
    }

    public String getContatoEmergenciaParentesco() {
        return contatoEmergenciaParentesco;
    }

    public String getContatoEmergenciaContato() {
        return contatoEmergenciaContato;
    }

    public String getAlergiasIntolerancias() {
        return alergiasIntolerancias;
    }

    public String getNecessidadesEspeciais() {
        return necessidadesEspeciais;
    }

    public boolean isParticipouDeRetiro() {
        return participouDeRetiro;
    }

    public String getComunidadeOrigem() {
        return comunidadeOrigem;
    }

    public String getDonsHabilidades() {
        return donsHabilidades;
    }

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public String getComprovantePagamento() {
        return comprovantePagamento;
    }

    public boolean isConsentimentoImagem() {
        return consentimentoImagem;
    }

    public boolean isConsentimentoDados() {
        return consentimentoDados;
    }

    public static final class Builder {
        private Long id;
        private String nomeCompleto;
        private LocalDate dataNascimento;
        private Integer idade;
        private String responsavelLegalNome;
        private String responsavelLegalContato;
        private String documentoIdentificacao;
        private String contatoIndividual;
        private String endereco;
        private String tamanhoCamisa;
        private String contatoEmergenciaNome;
        private String contatoEmergenciaParentesco;
        private String contatoEmergenciaContato;
        private String alergiasIntolerancias;
        private String necessidadesEspeciais;
        private boolean participouDeRetiro;
        private String comunidadeOrigem;
        private String donsHabilidades;
        private FormaPagamento formaPagamento;
        private String comprovantePagamento;
        private boolean consentimentoImagem;
        private boolean consentimentoDados;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder nomeCompleto(String nomeCompleto) {
            this.nomeCompleto = nomeCompleto;
            return this;
        }

        public Builder dataNascimento(LocalDate dataNascimento) {
            this.dataNascimento = dataNascimento;
            return this;
        }

        public Builder idade(Integer idade) {
            this.idade = idade;
            return this;
        }

        public Builder responsavelLegalNome(String responsavelLegalNome) {
            this.responsavelLegalNome = responsavelLegalNome;
            return this;
        }

        public Builder responsavelLegalContato(String responsavelLegalContato) {
            this.responsavelLegalContato = responsavelLegalContato;
            return this;
        }

        public Builder documentoIdentificacao(String documentoIdentificacao) {
            this.documentoIdentificacao = documentoIdentificacao;
            return this;
        }

        public Builder contatoIndividual(String contatoIndividual) {
            this.contatoIndividual = contatoIndividual;
            return this;
        }

        public Builder endereco(String endereco) {
            this.endereco = endereco;
            return this;
        }

        public Builder tamanhoCamisa(String tamanhoCamisa) {
            this.tamanhoCamisa = tamanhoCamisa;
            return this;
        }

        public Builder contatoEmergenciaNome(String contatoEmergenciaNome) {
            this.contatoEmergenciaNome = contatoEmergenciaNome;
            return this;
        }

        public Builder contatoEmergenciaParentesco(String contatoEmergenciaParentesco) {
            this.contatoEmergenciaParentesco = contatoEmergenciaParentesco;
            return this;
        }

        public Builder contatoEmergenciaContato(String contatoEmergenciaContato) {
            this.contatoEmergenciaContato = contatoEmergenciaContato;
            return this;
        }

        public Builder alergiasIntolerancias(String alergiasIntolerancias) {
            this.alergiasIntolerancias = alergiasIntolerancias;
            return this;
        }

        public Builder necessidadesEspeciais(String necessidadesEspeciais) {
            this.necessidadesEspeciais = necessidadesEspeciais;
            return this;
        }

        public Builder participouDeRetiro(boolean participouDeRetiro) {
            this.participouDeRetiro = participouDeRetiro;
            return this;
        }

        public Builder comunidadeOrigem(String comunidadeOrigem) {
            this.comunidadeOrigem = comunidadeOrigem;
            return this;
        }

        public Builder donsHabilidades(String donsHabilidades) {
            this.donsHabilidades = donsHabilidades;
            return this;
        }

        public Builder formaPagamento(FormaPagamento formaPagamento) {
            this.formaPagamento = formaPagamento;
            return this;
        }

        public Builder comprovantePagamento(String comprovantePagamento) {
            this.comprovantePagamento = comprovantePagamento;
            return this;
        }

        public Builder consentimentoImagem(boolean consentimentoImagem) {
            this.consentimentoImagem = consentimentoImagem;
            return this;
        }

        public Builder consentimentoDados(boolean consentimentoDados) {
            this.consentimentoDados = consentimentoDados;
            return this;
        }

        public InscricaoRetiroEntity build() {
            validar();
            return new InscricaoRetiroEntity(this);
        }

        private void validar() {
            Objects.requireNonNull(nomeCompleto, "nomeCompleto obrigatorio");
            Objects.requireNonNull(dataNascimento, "dataNascimento obrigatorio");
            Objects.requireNonNull(documentoIdentificacao, "documentoIdentificacao obrigatorio");
            Objects.requireNonNull(contatoIndividual, "contatoIndividual obrigatorio");
            Objects.requireNonNull(endereco, "endereco obrigatorio");
            Objects.requireNonNull(tamanhoCamisa, "tamanhoCamisa obrigatorio");
            Objects.requireNonNull(contatoEmergenciaNome, "contatoEmergenciaNome obrigatorio");
            Objects.requireNonNull(contatoEmergenciaParentesco, "contatoEmergenciaParentesco obrigatorio");
            Objects.requireNonNull(contatoEmergenciaContato, "contatoEmergenciaContato obrigatorio");
            Objects.requireNonNull(comunidadeOrigem, "comunidadeOrigem obrigatorio");
            Objects.requireNonNull(donsHabilidades, "donsHabilidades obrigatorio");
            Objects.requireNonNull(formaPagamento, "formaPagamento obrigatorio");
        }
    }
}
