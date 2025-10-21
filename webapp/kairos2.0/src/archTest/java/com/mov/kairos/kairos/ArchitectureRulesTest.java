package com.mov.kairos.kairos;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(
        packages = "com.mov.kairos.kairos",
        importOptions = {ImportOption.DoNotIncludeTests.class}
)
public class ArchitectureRulesTest {

    private static final String DOMINIO = "com.mov.kairos.kairos.dominio..";
    private static final String DOMINIO_CASO_USO = "com.mov.kairos.kairos.dominio.casouso..";
    private static final String DOMINIO_ENTIDADE = "com.mov.kairos.kairos.dominio.entidade..";
    private static final String DOMINIO_REPOSITORIO = "com.mov.kairos.kairos.dominio.repositorio..";
    private static final String APLICACAO = "com.mov.kairos.kairos.aplicacao..";
    private static final String INFRAESTRUTURA = "com.mov.kairos.kairos.infraestrutura..";
    private static final String INFRAESTRUTURA_JPA = "com.mov.kairos.kairos.infraestrutura.jpa..";
    private static final String JAVA = "java..";
    private static final String JAKARTA = "jakarta..";
    private static final String SPRING = "org.springframework..";
    private static final String SLF4J = "org.slf4j..";
    private static final String JACKSON = "com.fasterxml.jackson..";

    private static final String[] APLICACAO_DEPENDENCIAS_PERMITIDAS = {
            APLICACAO,
            DOMINIO_CASO_USO,
            DOMINIO_ENTIDADE,
            DOMINIO_REPOSITORIO,
            INFRAESTRUTURA,
            JAVA,
            JAKARTA,
            SPRING,
            SLF4J,
            JACKSON
    };

    private static final String[] INFRAESTRUTURA_DEPENDENCIAS_PERMITIDAS = {
            INFRAESTRUTURA,
            INFRAESTRUTURA_JPA,
            DOMINIO_ENTIDADE,
            DOMINIO_REPOSITORIO,
            JAVA,
            JAKARTA,
            SPRING,
            SLF4J
    };

    @ArchTest
    static final ArchRule dominio_sem_dependencias_externas =
            noClasses()
                    .that().resideInAnyPackage(DOMINIO)
                    .should().dependOnClassesThat()
                    .resideInAnyPackage(APLICACAO, INFRAESTRUTURA, SPRING, JAKARTA);

    @ArchTest
    static final ArchRule aplicacao_somente_usecases_entidades_dominio_e_infra =
            classes()
                    .that().resideInAnyPackage(APLICACAO)
                    .should().onlyDependOnClassesThat()
                    .resideInAnyPackage(APLICACAO_DEPENDENCIAS_PERMITIDAS);

    @ArchTest
    static final ArchRule aplicacao_nao_depende_de_dominio_exceto_usecases_entidades_e_repositorios =
            classes()
                    .that().resideInAnyPackage(APLICACAO)
                    .should().onlyDependOnClassesThat()
                    .resideInAnyPackage(APLICACAO_DEPENDENCIAS_PERMITIDAS);

    @ArchTest
    static final ArchRule infraestrutura_nao_acessa_aplicacao =
            noClasses()
                    .that().resideInAnyPackage(INFRAESTRUTURA)
                    .should().dependOnClassesThat()
                    .resideInAnyPackage(APLICACAO);

    @ArchTest
    static final ArchRule infraestrutura_nao_depende_de_dominio_concreto =
            noClasses()
                    .that().resideInAnyPackage(INFRAESTRUTURA)
                    .should().dependOnClassesThat()
                    .resideInAnyPackage(DOMINIO_CASO_USO);

    @ArchTest
    static final ArchRule infraestrutura_somente_repo_interfaces_do_dominio_ou_frameworks =
            classes()
                    .that().resideInAnyPackage(INFRAESTRUTURA)
                    .should().onlyDependOnClassesThat()
                    .resideInAnyPackage(INFRAESTRUTURA_DEPENDENCIAS_PERMITIDAS);

    @ArchTest
    static final ArchRule jpa_repositories_nao_acessados_fora_da_infra =
            noClasses()
                    .that().resideOutsideOfPackage(INFRAESTRUTURA)
                    .should().dependOnClassesThat()
                    .resideInAnyPackage(INFRAESTRUTURA_JPA);
}
