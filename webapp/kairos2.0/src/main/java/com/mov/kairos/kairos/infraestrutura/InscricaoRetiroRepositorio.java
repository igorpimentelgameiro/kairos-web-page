package com.mov.kairos.kairos.infraestrutura;

import com.mov.kairos.kairos.dominio.entidade.ContatoEmergencia;
import com.mov.kairos.kairos.dominio.entidade.InscricaoRetiro;
import com.mov.kairos.kairos.dominio.entidade.ResponsavelLegal;
import com.mov.kairos.kairos.dominio.repositorio.IInscricaoRepositorio;
import com.mov.kairos.kairos.infraestrutura.jpa.InscricaoRetiroEntity;
import com.mov.kairos.kairos.infraestrutura.jpa.InscricaoRetiroJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Objects;

@Repository
public class InscricaoRetiroRepositorio implements IInscricaoRepositorio {

    private final InscricaoRetiroJpaRepository jpaRepository;

    public InscricaoRetiroRepositorio(InscricaoRetiroJpaRepository jpaRepository) {
        this.jpaRepository = Objects.requireNonNull(jpaRepository, "jpaRepository nao pode ser nulo");
    }

    @Override
    public InscricaoRetiro salvar(InscricaoRetiro inscricao) {
        InscricaoRetiroEntity entidadePersistida = jpaRepository.save(toEntity(inscricao));
        return toDomain(entidadePersistida);
    }

    private InscricaoRetiroEntity toEntity(InscricaoRetiro inscricao) {
        ResponsavelLegal responsavelLegal = inscricao.responsavelLegal();
        ContatoEmergencia contatoEmergencia = inscricao.contatoEmergencia();

        return InscricaoRetiroEntity.builder()
                .id(inscricao.id())
                .nomeCompleto(inscricao.nomeCompleto())
                .dataNascimento(inscricao.dataNascimento())
                .idade(inscricao.idade())
                .responsavelLegalNome(responsavelLegal != null ? responsavelLegal.nome() : null)
                .responsavelLegalContato(responsavelLegal != null ? responsavelLegal.contato() : null)
                .documentoIdentificacao(inscricao.documentoIdentificacao())
                .contatoIndividual(inscricao.contatoIndividual())
                .endereco(inscricao.endereco())
                .tamanhoCamisa(inscricao.tamanhoCamisa())
                .contatoEmergenciaNome(contatoEmergencia.nome())
                .contatoEmergenciaParentesco(contatoEmergencia.parentesco())
                .contatoEmergenciaContato(contatoEmergencia.contato())
                .alergiasIntolerancias(inscricao.alergiasIntolerancias())
                .necessidadesEspeciais(inscricao.necessidadesEspeciais())
                .participouDeRetiro(inscricao.participouDeRetiro())
                .comunidadeOrigem(inscricao.comunidadeOrigem())
                .donsHabilidades(inscricao.donsHabilidades())
                .formaPagamento(inscricao.formaPagamento())
                .comprovantePagamento(inscricao.comprovantePagamento())
                .consentimentoImagem(inscricao.consentimentoImagem())
                .consentimentoDados(inscricao.consentimentoDados())
                .build();
    }

    private InscricaoRetiro toDomain(InscricaoRetiroEntity entidade) {
        ResponsavelLegal responsavelLegal = null;
        if (entidade.getResponsavelLegalNome() != null && entidade.getResponsavelLegalContato() != null) {
            responsavelLegal = new ResponsavelLegal(entidade.getResponsavelLegalNome(), entidade.getResponsavelLegalContato());
        }

        ContatoEmergencia contatoEmergencia = new ContatoEmergencia(
                entidade.getContatoEmergenciaNome(),
                entidade.getContatoEmergenciaParentesco(),
                entidade.getContatoEmergenciaContato()
        );

        return new InscricaoRetiro(
                entidade.getId(),
                entidade.getNomeCompleto(),
                entidade.getDataNascimento(),
                entidade.getIdade(),
                responsavelLegal,
                entidade.getDocumentoIdentificacao(),
                entidade.getContatoIndividual(),
                entidade.getEndereco(),
                entidade.getTamanhoCamisa(),
                contatoEmergencia,
                entidade.getAlergiasIntolerancias(),
                entidade.getNecessidadesEspeciais(),
                entidade.isParticipouDeRetiro(),
                entidade.getComunidadeOrigem(),
                entidade.getDonsHabilidades(),
                entidade.getFormaPagamento(),
                entidade.getComprovantePagamento(),
                entidade.isConsentimentoImagem(),
                entidade.isConsentimentoDados()
        );
    }
}
