# Kairos Monolito Modular

Este diretório abriga o frontend React + TypeScript do projeto Kairós.

## Estrutura

```
frontend/
├── public/
├── src/
│   ├── app/          → entrypoint e bootstrap
│   ├── componente/
│   ├── dominio/
│   ├── pagina/
│   └── assets/
├── package.json
└── vite.config.ts
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

Os comandos do frontend podem ser executados a partir da raiz do repositório via workspace npm:

```
npm install
npm run dev
npm run build
npm run lint
```

## Convenções

- Interfaces do domínio com prefixo `I`.
- Entidades JPA com sufixo `JpaEntity`.
- Camada de aplicação sem regras de negócio; domínios sem dependência de Spring.
- Reexecutar `npm run build` antes de publicar mudanças no frontend.
