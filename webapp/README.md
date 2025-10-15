# Kairos Monolito Modular

Este repositório reúne o frontend em React + TypeScript e o backend em Spring Boot em um monolito modular, organizado segundo Clean Architecture, DDD e os princípios SOLID.

## Estrutura de pastas



A pasta  mantém os assets estáticos do frontend. Scripts Node são executados a partir da raiz, enquanto o backend possui seus wrappers Gradle em .

## Frontend

- React, TypeScript, Vite.
- Código-fonte em  utilizando aliases (, , , , ).
- Componentes, hooks e páginas devem possuir arquivos de teste  escritos com Jest + React Testing Library.
- Style guide: Airbnb + Prettier; lint via 
> webapp@0.0.0 lint
> eslint ..
- Após qualquer alteração relevante, execute  e 
> webapp@0.0.0 build
> tsc -b && vite build.

## Backend

- Spring Boot (Java 21), PostgreSQL, Flyway, H2 para testes.
- Código organizado por camadas (, , ) com interfaces prefixadas por .
- Entidades de domínio preferencialmente records sobrescrevendo ,  e  com .
- Implementações concretas em  anotadas com ,  ou .
- Repositórios JPA em , modelos com sufixo , utilizando .

### Testes

- Executar  para a suíte padrão do backend.
- Executar  para validar as regras ArchUnit.
- Testes unitários em  e testes de integração () nas camadas de aplicação e infraestrutura com profile .

## Fluxo de desenvolvimento

1. **Domínio**: começar pelos testes de caso de uso e modelos de domínio (TDD).
2. **Infraestrutura**: criar testes de integração, implementar adaptadores reais e scripts Flyway quando necessário.
3. **Aplicação**: expor casos de uso por controllers, requests/responses e exception handlers com testes de integração.
4. **Frontend**: ajustar contratos em , atualizar páginas e componentes reutilizando .
5. Rodar a suíte completa (frontend + backend + ) antes de criar commits. Relatórios de revisão devem ser salvos em .

