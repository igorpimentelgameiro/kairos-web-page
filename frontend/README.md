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
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Os comandos do frontend podem ser executados a partir da raiz do repositório via workspace npm:

```
npm install
npm run dev
npm run build
npm run lint
```

## Convenções

- Reexecutar `npm run build` antes de publicar mudanças no frontend.
