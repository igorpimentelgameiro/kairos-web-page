package com.mov.kairos.kairos.aplicacao.controller;

import com.mov.kairos.kairos.aplicacao.request.inscricao.ContatoEmergenciaRequest;
import com.mov.kairos.kairos.aplicacao.request.inscricao.InscricaoRequest;
import com.mov.kairos.kairos.aplicacao.request.inscricao.ResponsavelLegalRequest;
import com.mov.kairos.kairos.aplicacao.response.inscricao.InscricaoResponse;
import com.mov.kairos.kairos.dominio.casouso.CadastrarInscricao;
import com.mov.kairos.kairos.dominio.entidade.ContatoEmergencia;
import com.mov.kairos.kairos.dominio.entidade.InscricaoRetiro;
import com.mov.kairos.kairos.dominio.entidade.ResponsavelLegal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Optional;

@RestController
@RequestMapping("/api/inscricoes")
public class InscricaoController {

    private final CadastrarInscricao cadastrarInscricao;

    public InscricaoController(CadastrarInscricao cadastrarInscricao) {
        this.cadastrarInscricao = cadastrarInscricao;
    }

    @PostMapping
    public ResponseEntity<InscricaoResponse> realizarInscricao(@Valid @RequestBody InscricaoRequest request) {
        InscricaoRetiro inscricaoCriada = cadastrarInscricao.executar(mapearParaDominio(request));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new InscricaoResponse(inscricaoCriada.id(), "Inscricao registrada com sucesso"));
    }

    private InscricaoRetiro mapearParaDominio(InscricaoRequest request) {
        ResponsavelLegal responsavelLegal = Optional.ofNullable(request.responsavelLegal())
                .map(this::mapearResponsavel)
                .orElse(null);

        ContatoEmergencia contatoEmergencia = mapearContatoEmergencia(request.contatoEmergencia());

        return new InscricaoRetiro(
                null,
                request.nomeCompleto().trim(),
                request.dataNascimento(),
                request.idade(),
                responsavelLegal,
                request.documentoIdentificacao().trim(),
                request.contatoIndividual().trim(),
                request.endereco().trim(),
                request.tamanhoCamisa().trim(),
                contatoEmergencia,
                normalizarTexto(request.alergiasIntolerancias()),
                normalizarTexto(request.necessidadesEspeciais()),
                request.participouDeRetiro(),
                request.comunidadeOrigem().trim(),
                request.donsHabilidades().trim(),
                request.formaPagamento(),
                normalizarTexto(request.comprovantePagamento()),
                request.consentimentoImagem(),
                request.consentimentoDados()
        );
    }

    private ResponsavelLegal mapearResponsavel(ResponsavelLegalRequest request) {
        String nome = request.nome() != null ? request.nome().trim() : null;
        String contato = request.contato() != null ? request.contato().trim() : null;

        boolean nomeVazio = nome == null || nome.isEmpty();
        boolean contatoVazio = contato == null || contato.isEmpty();

        if (nomeVazio && contatoVazio) {
            return null;
        }
        if (nomeVazio ^ contatoVazio) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "responsavelLegal deve conter nome e contato");
        }
        return new ResponsavelLegal(
                nome,
                contato
        );
    }

    private ContatoEmergencia mapearContatoEmergencia(ContatoEmergenciaRequest request) {
        return new ContatoEmergencia(
                request.nome().trim(),
                request.parentesco().trim(),
                request.contato().trim()
        );
    }

    private String normalizarTexto(String valor) {
        if (valor == null) {
            return null;
        }
        String normalizado = valor.trim();
        return normalizado.isEmpty() ? null : normalizado;
    }
}
