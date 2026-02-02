# Kairos Monolito Modular

Este diretório abriga o frontend React + TypeScript do monolito Kairos, agora localizado dentro da mesma árvore `src/main` do backend Spring Boot para manter o monorepo coeso.

## Estrutura

```
kairos2.0/
├── build.gradle.kts
├── settings.gradle.kts
└── src/
    └── main/
        ├── java/…           → código do backend (Clean Architecture)
        ├── javascript/      → este frontend (React + Vite)
        │   ├── public/
        │   └── src/main/javascript/
        │       ├── app/     → entrypoint e bootstrap
        │       ├── componente/
        │       ├── dominio/
        │       ├── pagina/
        │       └── assets/
        └── resources/
```

## Fluxo do Frontend

- Stack: React 19, TypeScript, Vite, TailwindCSS.
- Aliases configurados em `vite.config.ts` (`@app`, `@componente`, `@dominio`, `@pagina`, `@assets`).
- Scripts principais:

```
npm install
npm run dev
npm run build
npm run lint
```

- Testes (quando adicionados) devem viver ao lado dos componentes com o sufixo `.test.tsx` usando Jest + React Testing Library.

## Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_MOVIMENTO_USUARIO=admin
```

O cabeçalho `x-movimento-kairos-usuario` acompanha cada requisição ao backend e pode ser personalizado via `VITE_API_MOVIMENTO_USUARIO`.

## Backend

O backend permanece em `../java`, `../infraestrutura` etc. Use os wrappers Gradle a partir de `kairos2.0/`:

```
cd ../../..
./gradlew bootRun
./gradlew test
./gradlew archTest
```

## Convenções

- Interfaces do domínio com prefixo `I`.
- Entidades JPA com sufixo `JpaEntity`.
- Camada de aplicação sem regras de negócio; domínios sem dependência de Spring.
- Reexecutar `npm run build`, `./gradlew test` e `./gradlew archTest` antes de abrir PRs.
