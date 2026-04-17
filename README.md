# 🌟 Movimento Kairós – Site Oficial

Bem-vindo ao repositório do site do **Movimento Kairós**, um grupo solidário vinculado à **Basílica Santuário de Nossa Senhora de Nazaré**, com atuação desde março de 2023.

Este projeto visa divulgar nosso carisma, missão e ações através de uma página institucional acessível e leve.

## Estrutura Atual

- `frontend/` → aplicação React + TypeScript + Vite
- `dist/` e `assets/` na raiz → artefatos publicados para GitHub Pages
- `docs/` → documentação operacional, prompts e anotações do projeto

## Frontend

Os comandos do frontend são executados a partir da raiz do repositório via npm workspace:

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Publicação

O deploy do site agora é automático via GitHub Actions.

- Cada `push` para a branch `kairos-page-v3` executa testes, gera o build do `frontend/` e publica no GitHub Pages.
- O domínio customizado `kairosmov.com.br` é preservado pelo arquivo `CNAME`.
- O `404.html` continua sendo enviado junto do artefato para manter o fallback de rotas do SPA.

Para habilitar o fluxo no repositório:

1. Em `Settings > Pages`, selecione `GitHub Actions` como source.
2. Garanta que o fluxo esteja versionado na branch `kairos-page-v3`.
3. Faça push das mudanças para disparar o workflow `.github/workflows/deploy-pages.yml`.

`npm run deploy:prepare` pode continuar existindo para uso local, mas não é mais necessário para publicar o site.

---

## ✨ Sobre o Movimento

> "Viver o tempo de Deus, experimentar a Graça, e transformar vidas por meio da solidariedade."

Somos um movimento **sem fins lucrativos**, que acredita na força da comunhão e da espiritualidade para impactar positivamente a vida das pessoas. Nosso site apresenta quem somos, nosso propósito e meios de contato.


---
